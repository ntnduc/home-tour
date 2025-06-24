import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/BaseEntity';
import { PropertiesService } from '../../property/entities/properties-service.entity';

export enum ServiceCalculationMethod {
  FIXED_PER_ROOM = 'FIXED_PER_ROOM',
  FIXED_PER_PERSON = 'FIXED_PER_PERSON',
  PER_UNIT_SIMPLE = 'PER_UNIT_SIMPLE',
  PER_UNIT_TIERED = 'PER_UNIT_TIERED',
  FREE = 'FREE',
}

@Entity('services')
export class Services extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ServiceCalculationMethod,
    default: ServiceCalculationMethod.FIXED_PER_ROOM,
  })
  calculationMethod: ServiceCalculationMethod;

  @Column({ nullable: true })
  defaultUnitName: string;

  @OneToMany(
    () => PropertiesService,
    (propertiesService) => propertiesService.service,
  )
  propertiesServices: PropertiesService[];
}
