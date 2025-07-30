import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { TestChild } from './test-child.entity';
import { TestMapping } from './test-mapping.entity';

@Entity('test')
export class Test extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => TestChild, (testChild) => testChild.test, {
    cascade: true,
  })
  children: TestChild[];

  @OneToMany(() => TestMapping, (testMapping) => testMapping.test)
  testMappings: TestMapping[];
}
