import { InvoiceStatus } from 'src/common/enums/invoice.enum';
import { Contracts } from 'src/modules/contract/entities/contracts.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import { Properties } from 'src/modules/property/entities/properties.entity';
import { Rooms } from 'src/modules/property/entities/rooms.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';
import { InvoiceItem } from './invoice.item.entity';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @ManyToOne(() => Contracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contractId' })
  contract: Contracts;

  @Column()
  contractId: string;

  @Column()
  roomId: string;

  @ManyToOne(() => Rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Rooms;

  @Column()
  propertyId: string;

  @ManyToOne(() => Properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Properties;

  @Column({ type: 'varchar', length: 255, nullable: true })
  code?: string;

  @Column({ type: 'date' })
  billingPeriodStart: Date;

  @Column({ type: 'date' })
  billingPeriodEnd: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  remainingAmount: number;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  preInvoiceId?: string;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  invoiceItems: InvoiceItem[];

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];
}
