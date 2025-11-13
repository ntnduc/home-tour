import { RequestContextService } from 'src/common/base/context/request-context.service';
import { BaseEntity } from 'src/common/base/Entity/base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
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

  @BeforeInsert()
  public beforeInsert() {
    const user = RequestContextService.getUserObj();
    const userRoleCurretProperty = user?.properties?.find(
      (property: any) => property.id === this.contract.propertyId,
    );
    if (userRoleCurretProperty) {
      this.actorRole = userRoleCurretProperty.role;
    }
  }
}
