import { Contracts } from 'src/modules/contract/entities/contracts.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';

@Entity('clients')
export class Client extends BaseEntity {
  @Column({ length: 255 })
  fullName: string;

  @Column({ length: 20, unique: true })
  phoneNumber: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column({ length: 50, nullable: true })
  idCardNumber?: string;

  @Column({ type: 'text', nullable: true })
  permanentAddress?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ length: 255, nullable: true })
  profilePictureURL?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid', nullable: true })
  contractId?: string;

  @ManyToOne(() => Contracts, (contract) => contract.partnerClient)
  @JoinColumn({ name: 'contractId' })
  contract?: Contracts;
}
