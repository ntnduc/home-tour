import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PropertyService } from "./PropertyService";
import { UserProperties } from "./UserProperties";

@Entity("properties")
export class Properties {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => UserProperties, (userProperty) => userProperty.property)
  userProperties: UserProperties[];

  @OneToMany(
    () => PropertyService,
    (propertyService) => propertyService.property
  )
  propertyServices: PropertyService[];

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  provinceCode: number;

  @Column({ nullable: true })
  districtCode: number;

  @Column({ nullable: true })
  wardCode: number;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @Column({ nullable: true, default: 0 })
  defaultRoomRent: number;

  @Column({ nullable: true, default: 5 })
  paymentDate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
