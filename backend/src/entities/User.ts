import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
