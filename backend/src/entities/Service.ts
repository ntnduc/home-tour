import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PropertyService } from "./PropertyService";

export enum ServiceCalculationMethod {
  FIXED_PER_ROOM = "FIXED_PER_ROOM",
  FIXED_PER_PERSON = "FIXED_PER_PERSON",
  PER_UNIT_SIMPLE = "PER_UNIT_SIMPLE",
  PER_UNIT_TIERED = "PER_UNIT_TIERED",
  FREE = "FREE",
}

@Entity("service")
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ServiceCalculationMethod,
    default: ServiceCalculationMethod.FIXED_PER_ROOM,
  })
  calculationMethod: ServiceCalculationMethod;

  @OneToMany(
    () => PropertyService,
    (propertyService) => propertyService.service
  )
  propertyServices: PropertyService[];

  @Column({ nullable: true })
  defaultUnitName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
