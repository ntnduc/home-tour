import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contracts } from '../contract/entities/contracts.entity';
import { CurrentUserModule } from '../current.user';
import { PaymentModule } from '../payment/payment.module';
import { PropertiesService } from '../property/entities/properties-service.entity';
import { Properties } from '../property/entities/properties.entity';
import { Rooms } from '../property/entities/rooms.entity';
import { RbacModule } from '../rbac/rbac.module';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice.item.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './repositories/invoice.repository';
import { InvoiceItemRepository } from './repositories/invoice-item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceItem,
      Contracts,
      Rooms,
      Properties,
      PropertiesService,
    ]),
    CurrentUserModule,
    RbacModule,
    PaymentModule,
  ],
  providers: [
    InvoiceService,
    InvoiceRepository,
    InvoiceItemRepository,
  ],
  exports: [InvoiceService, InvoiceRepository, InvoiceItemRepository],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
