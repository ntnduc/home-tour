import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/BaseEntity';

@Entity('test')
export class Test extends BaseEntity {
  @Column()
  name: string;
}
