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
import { ContractPropertiesService } from './contract-properties.service';
import { ContractPropertyCreateDto } from './dto/contract-properties-dto/contract-property.create.dto';
import { ContractPropertyUpdateDto } from './dto/contract-properties-dto/contract-property.update.dto';

@ApiTags('Contract Properties')
@ApiBearerAuth()
@Controller('api/contract-properties')
@Roles(Role.ADMIN, Role.OWNER, Role.PROPERTY_MANAGER, Role.ACCOUNTANT)
export class ContractPropertiesController {
  constructor(
    private readonly contractPropertiesService: ContractPropertiesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add property to contract' })
  @ApiResponse({ status: 201, description: 'Property added successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Contract not found.' })
  async create(@Body() createDto: ContractPropertyCreateDto) {
    return await this.contractPropertiesService.create(createDto);
  }

  @Get('contract/:contractId')
  @ApiOperation({ summary: 'Get all properties by contract ID' })
  @ApiResponse({
    status: 200,
    description: 'List of properties for the contract.',
  })
  async getPropertiesByContractId(@Param('contractId') contractId: string) {
    return await this.contractPropertiesService.findByContractId(contractId);
  }

  @Get('contract/:contractId/active')
  @ApiOperation({ summary: 'Get active properties by contract ID' })
  @ApiResponse({
    status: 200,
    description: 'List of active properties for the contract.',
  })
  async getActivePropertiesByContractId(
    @Param('contractId') contractId: string,
  ) {
    return await this.contractPropertiesService.findActivePropertiesByContractId(
      contractId,
    );
  }

  @Get('property/:propertyUserId')
  @ApiOperation({ summary: 'Get contracts by property user ID' })
  @ApiResponse({
    status: 200,
    description: 'List of contracts for the property.',
  })
  async getContractsByPropertyUserId(
    @Param('propertyUserId') propertyUserId: string,
  ) {
    return await this.contractPropertiesService.findByPropertyUserId(
      propertyUserId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contract property' })
  @ApiResponse({
    status: 200,
    description: 'Contract property updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Contract property not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: ContractPropertyUpdateDto,
  ) {
    return await this.contractPropertiesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove property from contract' })
  @ApiResponse({ status: 200, description: 'Property removed successfully.' })
  @ApiResponse({ status: 404, description: 'Contract property not found.' })
  async remove(@Param('id') id: string) {
    await this.contractPropertiesService.remove(id);
    return { message: 'Property removed successfully' };
  }

  @Patch(':id/move-out')
  @ApiOperation({ summary: 'Mark property as moved out' })
  @ApiResponse({ status: 200, description: 'Property marked as moved out.' })
  @ApiResponse({ status: 404, description: 'Contract property not found.' })
  async moveOut(
    @Param('id') id: string,
    @Body() body: { moveOutDate: string },
  ) {
    const moveOutDate = new Date(body.moveOutDate);
    return await this.contractPropertiesService.moveOut(id, moveOutDate);
  }

  @Patch(':id/move-in')
  @ApiOperation({ summary: 'Mark property as moved in' })
  @ApiResponse({ status: 200, description: 'Property marked as moved in.' })
  @ApiResponse({ status: 404, description: 'Contract property not found.' })
  async moveIn(@Param('id') id: string, @Body() body: { moveInDate: string }) {
    const moveInDate = new Date(body.moveInDate);
    return await this.contractPropertiesService.moveIn(id, moveInDate);
  }
}
