import { IsNumber } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { ServiceCalculationMethod } from '../../../common/enums/service.enum';
import { removeAccents } from '../../../common/utils';
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

  @Column({ nullable: true })
  name_slug?: string;

  @Column({ nullable: false, default: false })
  isDefaultSelected: boolean;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false, default: 0 })
  @IsNumber()
  price: number;

  @OneToMany(
    () => PropertiesService,
    (propertiesService) => propertiesService.service,
  )
  propertiesServices: PropertiesService[];

  @BeforeInsert()
  generateNameSlug() {
    this.name_slug = removeAccents(this.name);
  }

  @BeforeUpdate()
  updateNameSlug() {
    this.name_slug = removeAccents(this.name);
  }
}
