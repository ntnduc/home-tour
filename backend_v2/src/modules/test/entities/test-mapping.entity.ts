import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/BaseEntity';
import { TestContent } from './test-content.entity';
import { Test } from './test.entity';

@Entity('test-mapping')
export class TestMapping extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => Test, (test) => test.testMappings)
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @Column()
  test_id: string;

  @ManyToOne(() => TestContent, (testContent) => testContent.testMappings)
  @JoinColumn({ name: 'test_content_id' })
  testContent: TestContent;

  @Column()
  test_content_id: string;
}
