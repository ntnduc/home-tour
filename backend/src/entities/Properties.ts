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

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  ward: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  description: string;

  @Column()
  defaultRoomRent: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => PropertyService,
    (propertyService) => propertyService.property
  )
  propertyServices: PropertyService[];
}
