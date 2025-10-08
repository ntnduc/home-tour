import { Client } from 'src/modules/client/entities/client.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { ContractStatus } from '../../../common/enums/contract.enum';
import { Properties } from '../../property/entities/properties.entity';
import { Rooms } from '../../property/entities/rooms.entity';
import { ContractClient } from './contract-client.entity';
import { ContractServices } from './contract-services.entity';

@Entity('contracts')
export class Contracts extends BaseEntity {
  @ManyToOne(() => Properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Properties;

  @Column()
  propertyId: string;

  @ManyToOne(() => Rooms)
  @JoinColumn({ name: 'roomId' })
  room: Rooms;

  @Column()
  roomId: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'landlordClientId' })
  landlordClient: Client;

  @Column()
  landlordClientId: string;

  @OneToMany(() => Client, (client) => client.contract)
  partnerClient?: Client[];

  @Column({ type: 'int', default: 0 })
  partnerClientCount: number;

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

  @OneToMany(() => ContractClient, (contractClient) => contractClient.contract)
  contractClient: ContractClient[];

  @OneToMany(
    () => ContractServices,
    (contractServices) => contractServices.contract,
  )
  contractServices: ContractServices[];
}
