import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/BaseEntity';
import { ServiceCalculationMethod } from '../../../common/enums/service.enum';
import { PropertiesService } from '../../property/entities/properties-service.entity';

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

  @Column({ nullable: true, default: 'apps-outline' })
  icon: string;

  @Column({ nullable: true })
  defaultUnitName: string;

  @OneToMany(
    () => PropertiesService,
    (propertiesService) => propertiesService.service,
  )
  propertiesServices: PropertiesService[];
}
