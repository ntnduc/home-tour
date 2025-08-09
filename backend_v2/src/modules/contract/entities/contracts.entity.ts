import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { ContractStatus } from '../../../common/enums/contract.enum';
import { Properties } from '../../property/entities/properties.entity';
import { Rooms } from '../../property/entities/rooms.entity';
import { User } from '../../users/entities/user.entity';
import { ContractProperties } from './contract-properties.entity';
import { ContractServices } from './contract-services.entity';

@Entity('contracts')
export class Contracts extends BaseEntity {
  @ManyToOne(() => Properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Properties;

  @Column()
  propertyId: string;

  @ManyToOne(() => Rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Rooms;

  @Column()
  roomId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'primaryTenantUserId' })
  primaryTenant: User;

  @Column()
  primaryTenantUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'landlordUserId' })
  landlord: User;

  @Column()
  landlordUserId: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  rentAmountAgreed: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  depositAmountPaid: number;

  @Column()
  paymentDueDay: number;

  @Column({ nullable: true })
  contractScanURL?: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.PENDING_START,
  })
  status: ContractStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(
    () => ContractProperties,
    (contractProperties) => contractProperties.contract,
  )
  contractProperties: ContractProperties[];

  @OneToMany(
    () => ContractServices,
    (contractServices) => contractServices.contract,
  )
  contractServices: ContractServices[];
}
