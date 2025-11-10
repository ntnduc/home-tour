import { BaseEntity } from 'src/common/base/Entity/base.entity';
import { ConfigResetType } from 'src/common/enums/config.enum';
import { Column, Entity } from 'typeorm';

@Entity('code_configs')
export class CodeConfig extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  propertyId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  prefix: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  suffix: string;

  @Column({
    type: 'enum',
    enum: ConfigResetType,
    default: ConfigResetType.NONE,
  })
  resetType: ConfigResetType;

  @Column({ type: 'text', nullable: true })
  format: string;

  @Column({ type: 'text', nullable: true })
  formatDatePattern: string;

  @Column({ type: 'int', nullable: true })
  length: number;
}
