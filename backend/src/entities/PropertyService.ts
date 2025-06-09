import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Properties } from "./Properties";
import { Service } from "./Service";

@Entity("property_service")
export class PropertyService {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Properties, (property) => property.propertyServices, {
    onDelete: "CASCADE",
  })
  property: Properties;

  @Column()
  propertyId: number;

  @ManyToOne(() => Service, (service) => service.propertyServices, {
    onDelete: "CASCADE",
  })
  service: Service;

  @Column()
  serviceId: number;

  @Column()
  price: number;

  @Column()
  unit: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
