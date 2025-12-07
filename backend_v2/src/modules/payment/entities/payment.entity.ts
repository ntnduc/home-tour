import { PaymentStatus, PaymentType } from 'src/common/enums/payment.enum';
import { Invoice } from 'src/modules/invoice/entities/invoice.entity';
import { Properties } from 'src/modules/property/entities/properties.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/Entity/base.entity';

@Entity('payments')
export class Payment extends BaseEntity {
  @Column()
  invoiceId: string;

  @ManyToOne(() => Invoice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column()
  paymentDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  propertyId: string;

  @ManyToOne(() => Properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Properties;

  @Column({ type: 'enum', enum: PaymentType })
  type: PaymentType;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ nullable: true })
  notes?: string;
}
