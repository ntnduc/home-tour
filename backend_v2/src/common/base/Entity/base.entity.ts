import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RequestContextService } from '../context/request-context.service';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true })
  public createdBy: string;

  @Column({ nullable: true })
  public updatedBy: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @BeforeInsert()
  public beforeInsert() {
    const userId = RequestContextService.getUserId();
    if (userId) {
      this.createdBy = userId;
      this.updatedBy = userId;
    }
  }

  @BeforeUpdate()
  public beforeUpdate() {
    const userId = RequestContextService.getUserId();
    if (userId) {
      this.updatedBy = userId;
    }
  }
}
