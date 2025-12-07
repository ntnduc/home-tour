import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from '../../common/base/crud/base.controller';
import { AutoCrudPermissions } from '../../common/decorators/crud-permissions.decorator';
import { InvoiceStatus } from '../../common/enums/invoice.enum';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../rbac/decorators/roles.decorator';
import { InvoiceCreateDto } from './dto/invoice-dto/invoice.create.dto';
import { InvoiceDetailDto } from './dto/invoice-dto/invoice.detail.dto';
import { InvoiceListDto } from './dto/invoice-dto/invoice.list.dto';
import { InvoiceUpdateDto } from './dto/invoice-dto/invoice.update.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoiceService } from './invoice.service';

@ApiTags('Invoice')
@ApiBearerAuth()
@Controller('api/invoice')
@Roles(
  Role.ADMIN,
  Role.OWNER,
  Role.PROPERTY_MANAGER,
  Role.ACCOUNTANT,
  Role.TENANT,
)
@AutoCrudPermissions('INVOICE')
export class InvoiceController extends BaseController<
  InvoiceService,
  Invoice,
  InvoiceDetailDto,
  InvoiceListDto,
  InvoiceCreateDto,
  InvoiceUpdateDto
> {
  constructor(private readonly invoiceService: InvoiceService) {
    super(
      invoiceService,
      InvoiceDetailDto,
      InvoiceListDto,
      InvoiceCreateDto,
      InvoiceUpdateDto,
    );
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get invoices by status' })
  @ApiResponse({
    status: 200,
    description: 'List of invoices with specified status.',
  })
  async getInvoicesByStatus(
    @Param('status') status: InvoiceStatus,
    @Query() query: any,
  ) {
    query.status = status;
    return await this.getAll(query);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiResponse({
    status: 200,
    description: 'Invoice status updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  async updateInvoiceStatus(
    @Param('id') id: string,
    @Body() body: { status: InvoiceStatus },
  ) {
    const updateDto = new InvoiceUpdateDto();
    updateDto.id = id;
    updateDto.status = body.status;
    return await this.invoiceService.update(updateDto);
  }

  @Patch(':id/payment')
  @ApiOperation({ summary: 'Update invoice payment' })
  @ApiResponse({
    status: 200,
    description: 'Invoice payment updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  async updateInvoicePayment(
    @Param('id') id: string,
    @Body() body: { paidAmount: number },
  ) {
    const invoice = await this.invoiceService.get(id);

    const updateDto = new InvoiceUpdateDto();
    updateDto.id = id;
    updateDto.paidAmount = body.paidAmount;
    updateDto.remainingAmount = invoice.totalAmount - body.paidAmount;

    if (body.paidAmount >= invoice.totalAmount) {
      updateDto.status = InvoiceStatus.PAID;
    } else if (body.paidAmount > 0) {
      updateDto.status = InvoiceStatus.PARTIALLY_PAID;
    }

    return await this.invoiceService.update(updateDto);
  }
}

