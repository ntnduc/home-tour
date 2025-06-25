import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/BaseEntity';
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

  @ManyToOne(() => Services, (services) => services.propertiesServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceId' })
  service: Services;

  @Column()
  @IsNotEmpty()
  serviceId: string;

  @Column({
    type: 'enum',
    enum: ServiceCalculationMethod,
    default: ServiceCalculationMethod.FREE,
    enumName: 'service_calculation_method',
  })
  calculationMethod: ServiceCalculationMethod;
}
