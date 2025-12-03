import { IsInt, Max, Min } from "class-validator";
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
    (propertyService) => propertyService.property,
    {
      cascade: true,
    }
  )
  propertyServices: PropertyService[];

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
  @IsInt({ message: "Ngày thanh toán phải là số nguyên!" })
  @Min(1, { message: "Ngày thanh toán không hợp lệ!" })
  @Max(31, { message: "Ngày thanh toán không hợp lệ!" })
  paymentDate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
