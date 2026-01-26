import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { FileCollection } from './file-collection.entity';

@Entity('file_entries')
export class FileEntry extends BaseEntity {
  // ========== THÔNG TIN FILE GỐC ==========

  /**
   * Tên file gốc mà người dùng upload
   * Ví dụ: "Hợp đồng thuê phòng số 123.pdf"
   */
  @Column({ length: 255 })
  originalName: string;

  /**
   * Tên file đã được lưu trên server (UUID + extension)
   * Ví dụ: "c3b6b1e0-8f2a-4e1d-9f3c-2a8b5d7e1f4a.pdf"
   */
  @Column({ length: 255 })
  fileName: string;

  /**
   * MIME type của file
   * Ví dụ: "image/jpeg", "application/pdf", "image/png"
   */
  @Column({ length: 100 })
  mimeType: string;

  /**
   * Kích thước file tính bằng bytes
   * Ví dụ: 2048576 (2MB)
   */
  @Column({ type: 'bigint' })
  fileSize: number;

  /**
   * Phần mở rộng của file (có dấu chấm)
   * Ví dụ: ".pdf", ".jpg", ".png", ".docx"
   */
  @Column({ length: 10 })
  extension: string;

  // ========== ĐƯỜNG DẪN LƯU TRỮ ==========

  /**
   * Đường dẫn tương đối trên server từ thư mục uploads
   * Ví dụ: "2026/01/26/c3b6b1e0-8f2a-4e1d-9f3c-2a8b5d7e1f4a.pdf"
   * URL sẽ được generate động từ filePath + base URL trong config
   */
  @Column({ type: 'text' })
  filePath: string;

  /**
   * Thứ tự file trong collection (nullable)
   * Dùng để sắp xếp khi hiển thị nhiều file
   */
  @Column({ nullable: true })
  order?: number;

  /**
   * Metadata tùy chỉnh cho file này (nullable)
   * Ví dụ: { width: 1920, height: 1080 } cho ảnh
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // ========== QUAN HỆ ==========

  /**
   * Collection mà file này thuộc về
   */
  @ManyToOne(() => FileCollection, (collection) => collection.files, {
    onDelete: 'CASCADE', // Khi xóa collection thì xóa luôn file entry
  })
  @JoinColumn({ name: 'collectionId' })
  collection: FileCollection;

  /**
   * ID của collection
   */
  @Column()
  collectionId: string;

  // ========== TRẠNG THÁI ==========

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
}
