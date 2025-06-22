import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/BaseEntity';
import { User } from '../../users/entities/user.entity';

@Entity('properties')
export class Properties extends BaseEntity {
  // @OneToMany(() => UserProperties, (userProperty) => userProperty.property)
  // userProperties: UserProperties[];
  // @OneToMany(
  //   () => PropertyService,
  //   (propertyService) => propertyService.property,
  //   {
  //     cascade: true,
  //   },
  // )
  // propertyServices: PropertyService[];
  @ManyToOne(() => User, (user) => user.properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  @IsNotEmpty()
  ownerId: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  provinceCode: string;

  @Column({ nullable: true })
  districtCode: string;

  @Column({ nullable: true })
  wardCode: string;

  @Column({ nullable: true })
  latitude?: number;

  @Column({ nullable: true })
  longitude?: number;

  @Column({ nullable: true, default: 0 })
  defaultRoomRent: number;

  @Column({ default: 5 })
  @IsInt({ message: 'Ngày thanh toán phải là số nguyên!' })
  @Min(1, { message: 'Ngày thanh toán không hợp lệ!' })
  @Max(31, { message: 'Ngày thanh toán không hợp lệ!' })
  paymentDate: number;
}
