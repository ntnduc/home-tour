import { BaseEntity } from 'src/common/base/Entity/base.entity';
import { Properties } from 'src/modules/property/entities/properties.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ContractChangeLog } from './contract-change-log.entity';
import { Contracts } from './contracts.entity';

@Entity('contract_change_detail')
@Unique(['contractId', 'changeLogId'])
export class ContractChangeDetail extends BaseEntity {
  @ManyToOne(() => Contracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contractId' })
  contract: Contracts;

  @Column()
  contractId: string;

  @ManyToOne(() => Properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Properties;

  @Column()
  propertyId: string;

  @ManyToOne(() => ContractChangeLog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'changeLogId' })
  changeLog: ContractChangeLog;

  @Column()
  changeLogId: string;

  @Column()
  field: string;

  @Column({ type: 'jsonb' })
  oldValue: string;

  @Column({ type: 'jsonb' })
  newValue: string;
}
