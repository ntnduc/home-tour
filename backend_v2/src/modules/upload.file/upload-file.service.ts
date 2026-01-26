import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { SelectQueryBuilder } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from '../../common/base/crud/base.service';
import { IBaseService } from '../../common/base/crud/IService';
import { UploadFileConfig } from './config/upload-file.config';
import { FileCollectionCreateDto } from './dto/file-collection.create.dto';
import { FileCollectionDetailDto } from './dto/file-collection.detail.dto';
import { FileCollectionListDto } from './dto/file-collection.list.dto';
import { FileCollectionUpdateDto } from './dto/file-collection.update.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { FileCollection } from './entities/file-collection.entity';
import { FileEntry } from './entities/file-entry.entity';
import { FileCollectionRepository } from './repositories/file-collection.repository';
import { FileEntryRepository } from './repositories/file-entry.repository';

@Injectable()
export class UploadFileService
  extends BaseService<
    FileCollection,
    FileCollectionDetailDto,
    FileCollectionListDto,
    FileCollectionCreateDto,
    FileCollectionUpdateDto
  >
  implements
    IBaseService<
      FileCollection,
      FileCollectionDetailDto,
      FileCollectionListDto,
      FileCollectionCreateDto,
      FileCollectionUpdateDto
    >
{
  private readonly config: UploadFileConfig;

  constructor(
    @InjectRepository(FileCollection)
    private readonly fileCollectionRepository: FileCollectionRepository,
    @InjectRepository(FileEntry)
    private readonly fileEntryRepository: FileEntryRepository,
    private readonly configService: ConfigService,
  ) {
    super(
      fileCollectionRepository,
      FileCollectionDetailDto,
      FileCollectionListDto,
      FileCollectionCreateDto,
      FileCollectionUpdateDto,
    );
    const config = this.configService.get<UploadFileConfig>('uploadFile');
    if (!config) {
      throw new Error('UploadFile config is not defined');
    }
    this.config = config;
  }

  async specQuery(): Promise<SelectQueryBuilder<FileCollection>> {
    const query = this.fileCollectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.files', 'files')
      .where('collection.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('files.isDeleted = :fileDeleted', { fileDeleted: false });
    return query;
  }

  /**
   * Upload single file
   */
  async uploadFile(
    file: Express.Multer.File,
    dto: FileUploadDto,
  ): Promise<FileCollectionDetailDto> {
    if (!file) {
      throw new BadRequestException('File không được để trống');
    }

    // Validate file
    this.validateFile(file, dto.category);

    // Create file collection
    const collectionDto = new FileCollectionCreateDto();
    collectionDto.name = dto.name;
    collectionDto.category = dto.category;
    collectionDto.description = dto.description;
    collectionDto.relatedEntityType = dto.relatedEntityType;
    collectionDto.relatedEntityId = dto.relatedEntityId;
    collectionDto.isPublic = dto.isPublic ?? true;

    const collection = await this.create(collectionDto);

    // Save file to disk
    const fileEntry = await this.saveFileToDisk(file, collection.id, 1);

    // Get collection with files
    const collectionWithFiles = await this.fileCollectionRepository.findOne({
      where: { id: collection.id },
      relations: ['files'],
    });

    if (!collectionWithFiles) {
      throw new NotFoundException('Không tìm thấy collection sau khi tạo');
    }

    const detailDto = new FileCollectionDetailDto();
    detailDto.fromEntity(collectionWithFiles);
    return detailDto;
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: Express.Multer.File[],
    dto: FileUploadDto,
  ): Promise<FileCollectionDetailDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files không được để trống');
    }

    if (files.length > this.config.maxFilesPerRequest) {
      throw new BadRequestException(
        `Chỉ được upload tối đa ${this.config.maxFilesPerRequest} files`,
      );
    }

    // Validate all files
    files.forEach((file) => {
      this.validateFile(file, dto.category);
    });

    // Create file collection
    const collectionDto = new FileCollectionCreateDto();
    collectionDto.name = dto.name;
    collectionDto.category = dto.category;
    collectionDto.description = dto.description;
    collectionDto.relatedEntityType = dto.relatedEntityType;
    collectionDto.relatedEntityId = dto.relatedEntityId;
    collectionDto.isPublic = dto.isPublic ?? true;

    const collection = await this.create(collectionDto);

    // Save all files to disk
    const fileEntries = await Promise.all(
      files.map((file, index) =>
        this.saveFileToDisk(file, collection.id, index + 1),
      ),
    );

    // Get collection with files
    const collectionWithFiles = await this.fileCollectionRepository.findOne({
      where: { id: collection.id },
      relations: ['files'],
    });

    if (!collectionWithFiles) {
      throw new NotFoundException('Không tìm thấy collection sau khi tạo');
    }

    const detailDto = new FileCollectionDetailDto();
    detailDto.fromEntity(collectionWithFiles);
    return detailDto;
  }

  /**
   * Get file collection by ID with files
   */
  async getCollectionWithFiles(
    id: string,
  ): Promise<FileCollectionDetailDto> {
    const collection = await this.fileCollectionRepository.findOne({
      where: { id },
      relations: ['files'],
    });

    if (!collection) {
      throw new NotFoundException('Không tìm thấy collection');
    }

    const detailDto = new FileCollectionDetailDto();
    detailDto.fromEntity(collection);
    return detailDto;
  }

  /**
   * Get files by related entity
   */
  async getFilesByEntity(
    entityType: string,
    entityId: string,
  ): Promise<FileCollectionDetailDto[]> {
    const collections = await this.fileCollectionRepository.find({
      where: {
        relatedEntityType: entityType,
        relatedEntityId: entityId,
        isDeleted: false,
      },
      relations: ['files'],
    });

    return collections.map((collection) => {
      const detailDto = new FileCollectionDetailDto();
      detailDto.fromEntity(collection);
      return detailDto;
    });
  }

  /**
   * Generate URL from filePath
   */
  getFileUrl(filePath: string): string {
    return `${this.config.publicUrlPrefix}/${filePath}`;
  }

  /**
   * Get upload path
   */
  getUploadPath(): string {
    return this.config.uploadPath;
  }

  /**
   * Validate file
   */
  private validateFile(file: Express.Multer.File, category?: string): void {
    // Check file size
    const maxSize = category && this.config.categoryConfig[category]?.maxSize
      ? this.config.categoryConfig[category].maxSize
      : this.config.maxFileSize;

    if (file.size > maxSize) {
      throw new BadRequestException(
        `File vượt quá kích thước cho phép: ${maxSize / 1024 / 1024}MB`,
      );
    }

    // Check MIME type
    const allowedTypes = category && this.config.categoryConfig[category]?.allowedTypes
      ? this.config.categoryConfig[category].allowedTypes
      : this.config.allowedMimeTypes;

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Loại file không được phép. Chỉ chấp nhận: ${allowedTypes.join(', ')}`,
      );
    }

    // Check extension
    const extension = this.getFileExtension(file.originalname);
    const allowedExtensions = category && this.config.categoryConfig[category]?.allowedExtensions
      ? this.config.categoryConfig[category].allowedExtensions
      : this.config.allowedExtensions;

    if (!allowedExtensions.includes(extension.toLowerCase())) {
      throw new BadRequestException(
        `Extension không được phép. Chỉ chấp nhận: ${allowedExtensions.join(', ')}`,
      );
    }
  }

  /**
   * Save file to disk and create FileEntry
   */
  private async saveFileToDisk(
    file: Express.Multer.File,
    collectionId: string,
    order: number,
  ): Promise<FileEntry> {
    // Generate file name with UUID
    const extension = this.getFileExtension(file.originalname);
    const fileName = `${uuidv4()}${extension}`;

    // Create date-based directory structure: YYYY/MM/DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePath = `${year}/${month}/${day}`;

    // Full path
    const uploadPath = this.config.uploadPath;
    const fullDirPath = join(uploadPath, datePath);
    const filePath = `${datePath}/${fileName}`;
    const fullFilePath = join(fullDirPath, fileName);

    // Create directory if not exists
    if (!existsSync(fullDirPath)) {
      mkdirSync(fullDirPath, { recursive: true });
    }

    // Write file to disk
    writeFileSync(fullFilePath, file.buffer);

    // Create FileEntry
    const fileEntry = new FileEntry();
    fileEntry.originalName = file.originalname;
    fileEntry.fileName = fileName;
    fileEntry.mimeType = file.mimetype;
    fileEntry.fileSize = file.size;
    fileEntry.extension = extension;
    fileEntry.filePath = filePath;
    fileEntry.collectionId = collectionId;
    fileEntry.order = order;

    // Save to database
    return await this.fileEntryRepository.save(fileEntry);
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      throw new BadRequestException('File không có extension');
    }
    return filename.substring(lastDotIndex).toLowerCase();
  }

  /**
   * Soft delete collection
   */
  async deleteCollection(id: string): Promise<void> {
    const collection = await this.fileCollectionRepository.findOne({
      where: { id },
    });

    if (!collection) {
      throw new NotFoundException('Không tìm thấy collection');
    }

    collection.isDeleted = true;
    collection.deletedAt = new Date();
    await this.fileCollectionRepository.save(collection);
  }
}
