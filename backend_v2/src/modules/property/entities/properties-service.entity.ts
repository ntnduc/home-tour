import { IsNotEmpty, IsNumber } from 'class-validator';

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { ContractServices } from '../../contract/entities/contract-services.entity';
import { Services } from '../../services/entities/services.entity';
import { ServiceCalculationMethod } from './../../../common/enums/service.enum';
import { Properties } from './properties.entity';

@Entity('properties_services')
export class PropertiesService extends BaseEntity {
  @ManyToOne(() => Properties, (properties) => properties.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Properties;

  @Column()
  @IsNotEmpty()
  propertyId: string;

  @Column({ nullable: true })
  name?: string;

  @ManyToOne(() => Services, (services) => services.propertiesServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceId' })
  service: Services;

  @OneToMany(
    () => ContractServices,
    (contractServices) => contractServices.propertyService,
  )
  contractServices: ContractServices[];

  @Column()
  @IsNotEmpty()
  serviceId: string;

  @Column({ nullable: false, default: 0 })
  @IsNumber()
  price: number;

  @Column({
    type: 'enum',
    enum: ServiceCalculationMethod,
    default: ServiceCalculationMethod.FREE,
    enumName: 'service_calculation_method',
  })
  calculationMethod: ServiceCalculationMethod;
}
