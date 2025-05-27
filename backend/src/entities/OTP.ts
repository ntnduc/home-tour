import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("opt")
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column()
  code: string;

  @Column({ default: false })
  isUsed: boolean;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
