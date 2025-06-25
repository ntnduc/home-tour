import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/BaseEntity';
import { TestMapping } from './test-mapping.entity';

@Entity('test-content')
export class TestContent extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => TestMapping, (testMapping) => testMapping.testContent)
  testMappings: TestMapping[];
}
