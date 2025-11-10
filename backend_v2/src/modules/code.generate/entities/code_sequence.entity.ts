import { BaseEntity } from 'src/common/base/Entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('code_sequences')
export class CodeSequence extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  currentValue: string;

  @Column({ type: 'varchar', length: 255 })
  propertyId: string;

  @Column({ type: 'numeric', nullable: true })
  counter: bigint;

  @Column({ type: 'date', nullable: true })
  lastResetDate: Date;
}
