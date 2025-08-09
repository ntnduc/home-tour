import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../rbac/decorators/roles.decorator';
import { ContractServicesService } from './contract-services.service';
import { ContractServiceCreateDto } from './dto/contract-services-dto/contract-service.create.dto';
import { ContractServiceUpdateDto } from './dto/contract-services-dto/contract-service.update.dto';

@ApiTags('Contract Services')
@ApiBearerAuth()
@Controller('api/contract-services')
@Roles(Role.ADMIN, Role.OWNER, Role.PROPERTY_MANAGER, Role.ACCOUNTANT)
export class ContractServicesController {
  constructor(
    private readonly contractServicesService: ContractServicesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add service to contract' })
  @ApiResponse({ status: 201, description: 'Service added successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Contract or service not found.' })
  async create(@Body() createDto: ContractServiceCreateDto) {
    return await this.contractServicesService.create(createDto);
  }

  @Get('contract/:contractId')
  @ApiOperation({ summary: 'Get all services by contract ID' })
  @ApiResponse({
    status: 200,
    description: 'List of services for the contract.',
  })
  async getServicesByContractId(@Param('contractId') contractId: string) {
    return await this.contractServicesService.findByContractId(contractId);
  }

  @Get('contract/:contractId/enabled')
  @ApiOperation({ summary: 'Get enabled services by contract ID' })
  @ApiResponse({
    status: 200,
    description: 'List of enabled services for the contract.',
  })
  async getEnabledServicesByContractId(
    @Param('contractId') contractId: string,
  ) {
    return await this.contractServicesService.findEnabledServicesByContractId(
      contractId,
    );
  }

  @Get('contract/:contractId/service/:serviceId')
  @ApiOperation({ summary: 'Get specific service for contract' })
  @ApiResponse({ status: 200, description: 'Service details.' })
  @ApiResponse({
    status: 404,
    description: 'Service not found for this contract.',
  })
  async getServiceByContractIdAndServiceId(
    @Param('contractId') contractId: string,
    @Param('serviceId') serviceId: string,
  ) {
    return await this.contractServicesService.findByContractIdAndServiceId(
      contractId,
      serviceId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contract service' })
  @ApiResponse({
    status: 200,
    description: 'Contract service updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Contract service not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: ContractServiceUpdateDto,
  ) {
    return await this.contractServicesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove service from contract' })
  @ApiResponse({ status: 200, description: 'Service removed successfully.' })
  @ApiResponse({ status: 404, description: 'Contract service not found.' })
  async remove(@Param('id') id: string) {
    await this.contractServicesService.remove(id);
    return { message: 'Service removed successfully' };
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle service enabled/disabled' })
  @ApiResponse({ status: 200, description: 'Service toggled successfully.' })
  @ApiResponse({ status: 404, description: 'Contract service not found.' })
  async toggleService(
    @Param('id') id: string,
    @Body() body: { isEnabled: boolean },
  ) {
    return await this.contractServicesService.toggleService(id, body.isEnabled);
  }

  @Patch(':id/price')
  @ApiOperation({ summary: 'Update service price' })
  @ApiResponse({
    status: 200,
    description: 'Service price updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Contract service not found.' })
  async updatePrice(
    @Param('id') id: string,
    @Body() body: { customPrice: number },
  ) {
    return await this.contractServicesService.updatePrice(id, body.customPrice);
  }

  @Post('contract/:contractId/clone-from-property/:propertyId')
  @ApiOperation({ summary: 'Clone all services from property to contract' })
  @ApiResponse({ status: 201, description: 'Services cloned successfully.' })
  @ApiResponse({ status: 404, description: 'Contract or property not found.' })
  async cloneFromPropertyServices(
    @Param('contractId') contractId: string,
    @Param('propertyId') propertyId: string,
  ) {
    return await this.contractServicesService.cloneFromPropertyServices(
      contractId,
      propertyId,
    );
  }
}
