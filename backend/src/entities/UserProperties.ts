import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Properties } from "./Properties";
import { User } from "./User";

@Entity("user_properties")
export class UserProperties {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userProperties)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Properties, (property) => property.userProperties)
  @JoinColumn({ name: "property_id" })
  property: Properties;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
