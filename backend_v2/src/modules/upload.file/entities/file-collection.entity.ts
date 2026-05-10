import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { FileEntry } from './file-entry.entity';

@Entity('file_collections')
export class FileCollection extends BaseEntity {
  /**
   * Tên của collection (nullable)
   * Ví dụ: "Hợp đồng thuê phòng số 123", "Hóa đơn tháng 1/2026"
   */
  @Column({ length: 255, nullable: true })
  name?: string;

  /**
   * Phân loại collection (nullable)
   * Ví dụ: "contract", "invoice", "document", "avatar"
   */
  @Column({ length: 50, nullable: true })
  category?: string;

  /**
   * Mô tả về collection (nullable)
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Loại entity liên quan (nullable)
   * Ví dụ: "Contract", "Invoice", "Client", "Property"
   */
  @Column({ nullable: true })
  relatedEntityType?: string;

  /**
   * ID của entity liên quan (nullable)
   * Ví dụ: UUID của Contract hoặc Invoice
   */
  @Column({ nullable: true })
  relatedEntityId?: string;

  /**
   * Collection có public không (mặc định: true)
   * - true: Ai có link cũng có thể truy cập
   * - false: Phải có quyền (check qua JWT + RBAC)
   */
  @Column({ default: true })
  isPublic: boolean;

  /**
   * Flag soft delete (mặc định: false)
   */
  @Column({ default: false })
  isDeleted: boolean;

  /**
   * Thời gian xóa (nullable)
   */
  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  /**
   * Metadata tùy chỉnh cho collection (nullable)
   * Ví dụ: { totalSize: 10485760, fileCount: 5 }
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  propertyId?: string;

  // ========== QUAN HỆ ==========

  /**
   * Danh sách các file trong collection này
   */
  @OneToMany(() => FileEntry, (fileEntry) => fileEntry.collection, {
    cascade: true, // Khi xóa collection thì xóa luôn các file entries
  })
  files?: FileEntry[];
}
