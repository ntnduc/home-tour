import { IsOptional } from 'class-validator';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { FileCollection } from './file-collection.entity';

@Entity('file_entries')
export class FileEntry extends BaseEntity {
  @Column({ length: 255 })
  originalName: string;

  @Column({ length: 255 })
  fileName: string;

  @Column({ length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ length: 10 })
  extension: string;

  @Column({ type: 'text' })
  filePath: string;

  @Column({ nullable: true })
  order?: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => FileCollection, (collection) => collection.files, {
    onDelete: 'CASCADE', // Khi xóa collection thì xóa luôn file entry
  })
  @JoinColumn({ name: 'collectionId' })
  @IsOptional()
  collection?: FileCollection;

  @Column({ nullable: false, default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  @IsOptional()
  collectionId?: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  @DeleteDateColumn({ nullable: true, name: 'deletedAt' })
  deletedAt?: Date;

  @Column({ nullable: true })
  @IsOptional()
  propertyId?: string;

}
