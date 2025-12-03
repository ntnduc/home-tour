import { IsNotEmpty, IsString } from 'class-validator';
import { ServiceCalculationMethod } from 'src/common/enums/service.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { Contracts } from './contracts.entity';

@Entity('contract_services')
export class ContractServices extends BaseEntity {
  @ManyToOne(() => Contracts, (contract) => contract.contractServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contractId' })
  contract: Contracts;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  contractId: string;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0,
  })
  price: number;

  @Column({
    type: 'text',
    default: ServiceCalculationMethod.FREE,
  })
  calculationMethod: string;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ default: 0, nullable: true })
  helperValue?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
