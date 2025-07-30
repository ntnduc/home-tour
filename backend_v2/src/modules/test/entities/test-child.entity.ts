import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { Test } from './test.entity';

@Entity('test_child')
export class TestChild extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => Test, (test) => test.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'testId' })
  test: Test;

  @Column()
  testId: string;
}
