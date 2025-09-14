import { ServiceCalculationMethod } from 'src/common/enums/service.enum';
import { PropertiesService } from 'src/modules/property/entities/properties-service.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { Contracts } from './contracts.entity';

@Entity('contract_services')
@Unique(['contractId', 'propertyServiceId'])
export class ContractServices extends BaseEntity {
  @ManyToOne(() => Contracts, (contract) => contract.contractServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contractId' })
  contract: Contracts;

  @Column()
  contractId: string;

  @ManyToOne(
    () => PropertiesService,
    (propertiesService) => propertiesService.contractServices,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'propertyServiceId' })
  propertyService: PropertiesService;

  @Column()
  propertyServiceId: string;

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
