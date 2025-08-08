import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from 'src/common/base/crud/base.controller';
import { Permission, Role } from 'src/common/enums/role.enum';
import { StickAuthGaurd } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/permissions.decorator';
import { RequirePropertyAccess } from '../rbac/decorators/property-access.decorator';
import { Roles } from '../rbac/decorators/roles.decorator';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { PropertyAccessGuard } from '../rbac/guards/property-access.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { PropertyCreateDto } from './dto/properties-dto/property.create.dto';
import { PropertyDetailDto } from './dto/properties-dto/property.detail.dto';
import { PropertyListDto } from './dto/properties-dto/property.list.dto';
import { PropertyUpdateDto } from './dto/properties-dto/property.update.dto';
import { Properties } from './entities/properties.entity';
import { PropertyService } from './property.service';

@ApiTags('property')
@ApiBearerAuth()
@Controller('api/property')
@UseGuards(StickAuthGaurd, RolesGuard, PermissionsGuard, PropertyAccessGuard)
export class PropertyController extends BaseController<
  PropertyService,
  Properties,
  PropertyDetailDto,
  PropertyListDto,
  PropertyCreateDto,
  PropertyUpdateDto
> {
  constructor(private readonly propertyService: PropertyService) {
    super(
      propertyService,
      PropertyDetailDto,
      PropertyListDto,
      PropertyCreateDto,
      PropertyUpdateDto,
    );
  }

  // Override base methods to add property access control
  @Get(':id')
  @ApiOperation({ summary: 'Get a single property' })
  @ApiResponse({ status: 200, description: 'Property found.' })
  @ApiResponse({ status: 404, description: 'Property not found.' })
  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PROPERTY_MANAGER,
    Role.ACCOUNTANT,
    Role.TENANT,
  )
  @RequirePermissions(Permission.VIEW_PROPERTY)
  @RequirePropertyAccess()
  async get(@Param('id') id: string) {
    return await this.propertyService.get(id);
  }

  @Put()
  @ApiOperation({ summary: 'Update a property' })
  @ApiResponse({ status: 200, description: 'Property updated.' })
  @ApiResponse({ status: 404, description: 'Property not found.' })
  @Roles(Role.ADMIN, Role.OWNER, Role.PROPERTY_MANAGER)
  @RequirePermissions(Permission.EDIT_PROPERTY)
  @RequirePropertyAccess()
  async update(@Body() dto: PropertyUpdateDto) {
    return await this.propertyService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a property' })
  @ApiResponse({ status: 200, description: 'Property deleted.' })
  @ApiResponse({ status: 404, description: 'Property not found.' })
  @Roles(Role.ADMIN, Role.OWNER)
  @RequirePermissions(Permission.DELETE_PROPERTY)
  @RequirePropertyAccess()
  async delete(@Param('id') id: string) {
    return await this.propertyService.delete(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  @ApiResponse({ status: 201, description: 'Property created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Roles(Role.ADMIN, Role.OWNER)
  @RequirePermissions(Permission.CREATE_PROPERTY)
  async create(@Request() req: Request, @Body() dto: PropertyCreateDto) {
    return await this.propertyService.create(dto);
  }

  @Get('combo')
  @ApiOperation({ summary: 'Get combo property' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Entity already exists.' })
  @Roles(Role.ADMIN, Role.OWNER, Role.PROPERTY_MANAGER)
  @RequirePermissions(Permission.VIEW_PROPERTY)
  async getComboProperty() {
    return await this.propertyService.getComboProperty();
  }
}
