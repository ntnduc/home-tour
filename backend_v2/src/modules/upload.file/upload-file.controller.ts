import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { BaseController } from '../../common/base/crud/base.controller';
import { AutoCrudPermissions } from '../../common/decorators/crud-permissions.decorator';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../rbac/decorators/roles.decorator';
import { FileCollectionCreateDto } from './dto/file-collection.create.dto';
import { FileCollectionDetailDto } from './dto/file-collection.detail.dto';
import { FileCollectionListDto } from './dto/file-collection.list.dto';
import { FileCollectionUpdateDto } from './dto/file-collection.update.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { FileCollection } from './entities/file-collection.entity';
import { UploadFileService } from './upload-file.service';

@ApiTags('Upload File')
@ApiBearerAuth()
@Controller('api/upload-file')
@Roles(Role.ADMIN, Role.OWNER, Role.PROPERTY_MANAGER, Role.ACCOUNTANT)
@AutoCrudPermissions('UPLOAD_FILE')
export class UploadFileController extends BaseController<
  UploadFileService,
  FileCollection,
  FileCollectionDetailDto,
  FileCollectionListDto,
  FileCollectionCreateDto,
  FileCollectionUpdateDto
> {
  constructor(private readonly uploadFileService: UploadFileService) {
    super(
      uploadFileService,
      FileCollectionDetailDto,
      FileCollectionListDto,
      FileCollectionCreateDto,
      FileCollectionUpdateDto,
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
          description: 'Tên collection (optional)',
        },
        category: {
          type: 'string',
          description: 'Phân loại file (optional)',
        },
        description: {
          type: 'string',
          description: 'Mô tả (optional)',
        },
        relatedEntityType: {
          type: 'string',
          description: 'Loại entity liên quan (optional)',
        },
        relatedEntityId: {
          type: 'string',
          description: 'ID entity liên quan (optional)',
        },
        isPublic: {
          type: 'boolean',
          description: 'File có public không (optional, default: true)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: FileUploadDto,
  ): Promise<FileCollectionDetailDto> {
    return await this.uploadFileService.uploadFile(file, dto);
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        name: {
          type: 'string',
          description: 'Tên collection (optional)',
        },
        category: {
          type: 'string',
          description: 'Phân loại file (optional)',
        },
        description: {
          type: 'string',
          description: 'Mô tả (optional)',
        },
        relatedEntityType: {
          type: 'string',
          description: 'Loại entity liên quan (optional)',
        },
        relatedEntityId: {
          type: 'string',
          description: 'ID entity liên quan (optional)',
        },
        isPublic: {
          type: 'boolean',
          description: 'File có public không (optional, default: true)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: FileUploadDto,
  ): Promise<FileCollectionDetailDto> {
    return await this.uploadFileService.uploadFiles(files, dto);
  }

  @Get('collection/:id')
  @ApiOperation({ summary: 'Get file collection with files' })
  @ApiParam({ name: 'id', description: 'Collection ID' })
  @ApiResponse({ status: 200, description: 'Collection found' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async getCollectionWithFiles(
    @Param('id') id: string,
  ): Promise<FileCollectionDetailDto> {
    return await this.uploadFileService.getCollectionWithFiles(id);
  }

  @Get('by-entity')
  @ApiOperation({ summary: 'Get files by related entity' })
  @ApiQuery({ name: 'entityType', description: 'Loại entity' })
  @ApiQuery({ name: 'entityId', description: 'ID entity' })
  @ApiResponse({ status: 200, description: 'Files found' })
  async getFilesByEntity(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ): Promise<FileCollectionDetailDto[]> {
    return await this.uploadFileService.getFilesByEntity(entityType, entityId);
  }

  @Get('download/:collectionId/:fileId')
  @ApiOperation({ summary: 'Download file' })
  @ApiParam({ name: 'collectionId', description: 'Collection ID' })
  @ApiParam({ name: 'fileId', description: 'File Entry ID' })
  @ApiResponse({ status: 200, description: 'File downloaded' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async downloadFile(
    @Param('collectionId') collectionId: string,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ): Promise<void> {
    const collection = await this.uploadFileService.getCollectionWithFiles(
      collectionId,
    );

    const fileEntry = collection.files?.find((f) => f.id === fileId);
    if (!fileEntry) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    const uploadPath = await this.uploadFileService.getUploadPath();
    const fullPath = join(uploadPath, fileEntry.filePath);

    if (!existsSync(fullPath)) {
      res.status(404).json({ message: 'File not found on disk' });
      return;
    }

    const fileBuffer = readFileSync(fullPath);
    res.setHeader('Content-Type', fileEntry.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileEntry.originalName}"`,
    );
    res.send(fileBuffer);
  }

  @Delete('collection/:id')
  @ApiOperation({ summary: 'Delete file collection (soft delete)' })
  @ApiParam({ name: 'id', description: 'Collection ID' })
  @ApiResponse({ status: 200, description: 'Collection deleted' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async deleteCollection(@Param('id') id: string): Promise<void> {
    return await this.uploadFileService.deleteCollection(id);
  }
}
