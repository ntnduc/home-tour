import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { User } from '../../users/entities/user.entity';
import { Contracts } from './contracts.entity';

@Entity('contract_properties')
@Unique(['contractId', 'propertyUserId'])
export class ContractProperties extends BaseEntity {
  @ManyToOne(() => Contracts, (contract) => contract.contractProperties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contractId' })
  contract: Contracts;

  @Column()
  contractId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyUserId' })
  property: User;

  @Column()
  propertyUserId: string;

  @Column({ type: 'date', nullable: true })
  moveInDate?: Date;

  @Column({ type: 'date', nullable: true })
  moveOutDate?: Date;

  @Column({ default: true })
  isActiveInContract: boolean;
}
