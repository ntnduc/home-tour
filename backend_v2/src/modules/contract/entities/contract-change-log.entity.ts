import { BaseEntity } from 'src/common/base/Entity/base.entity';
import { Properties } from 'src/modules/property/entities/properties.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ContractChangeDetail } from './contract-change-detail.entity';
import { Contracts } from './contracts.entity';

@Entity('contract_change_log')
export class ContractChangeLog extends BaseEntity {
  @ManyToOne(() => Contracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contractId' })
  contract: Contracts;

  @OneToMany(
    () => ContractChangeDetail,
    (contractChangeDetail) => contractChangeDetail.changeLog,
    { cascade: true },
  )
  contractChangeDetails: ContractChangeDetail[];

  @ManyToOne(() => Properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Properties;

  @Column()
  propertyId: string;

  @Column()
  contractId: string;

  @Column()
  changeType: string;

  @Column()
  changeReason: string;

  @Column({ type: 'jsonb' })
  metadata: Record<string, any>;

  @Column()
  actorRole: string;
}
