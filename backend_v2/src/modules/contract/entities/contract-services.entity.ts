import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { Services } from '../../services/entities/services.entity';
import { Contracts } from './contracts.entity';

@Entity('contract_services')
@Unique(['contractId', 'serviceId'])
export class ContractServices extends BaseEntity {
  @ManyToOne(() => Contracts, (contract) => contract.contractServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contractId' })
  contract: Contracts;

  @Column()
  contractId: string;

  @ManyToOne(() => Services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Services;

  @Column()
  serviceId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  customPrice?: number;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
