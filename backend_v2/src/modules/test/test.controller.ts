import {
  Body,
  Controller,
  Get,
  Post,
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
import { Roles } from '../rbac/decorators/roles.decorator';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { TestMappingCreateDto } from './dto/test-mapping.create.dto';
import { TestCreateDto } from './dto/test.create.dto';
import { TestDetailDto } from './dto/test.detail.dto';
import { TestListDto } from './dto/test.list.dto';
import { TestUpdateDto } from './dto/test.update.dto';
import { Test } from './entities/test.entity';
import { TestService } from './test.service';

@ApiTags('Test')
@Controller('api/test')
export class TestController extends BaseController<
  TestService,
  Test,
  TestDetailDto,
  TestListDto,
  TestCreateDto,
  TestUpdateDto
> {
  constructor(private readonly testService: TestService) {
    super(
      testService,
      TestDetailDto,
      TestListDto,
      TestCreateDto,
      TestUpdateDto,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Entity already exists.' })
  async create(@Request() request: Request, @Body() dto: TestCreateDto) {
    return await super.create(request, dto);
  }

  @Post('create-mapping')
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Entity already exists.' })
  async createMapping(
    @Request() request: Request,
    @Body() dto: TestMappingCreateDto,
  ) {
    return await this.testService.createMapping(dto);
  }

  // Test endpoints for debugging guards
  @Get('public')
  @ApiOperation({ summary: 'Public test endpoint' })
  async publicEndpoint() {
    return { message: 'Public endpoint working', timestamp: new Date() };
  }

  @Get('auth-only')
  @ApiBearerAuth()
  @UseGuards(StickAuthGaurd)
  @ApiOperation({ summary: 'Auth only test endpoint' })
  async authOnlyEndpoint(@Request() req: any) {
    return {
      message: 'Auth only endpoint working',
      user: req.user,
      timestamp: new Date(),
    };
  }

  @Get('roles-test')
  @ApiBearerAuth()
  @UseGuards(StickAuthGaurd, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  @ApiOperation({ summary: 'Roles test endpoint' })
  async rolesTestEndpoint(@Request() req: any) {
    return {
      message: 'Roles test endpoint working',
      userRoles: req.user?.properties?.map((p: any) => p.role),
      timestamp: new Date(),
    };
  }

  @Get('permissions-test')
  @ApiBearerAuth()
  @UseGuards(StickAuthGaurd, PermissionsGuard)
  @RequirePermissions(Permission.VIEW_PROPERTY)
  @ApiOperation({ summary: 'Permissions test endpoint' })
  async permissionsTestEndpoint(@Request() req: any) {
    return {
      message: 'Permissions test endpoint working',
      userPermissions: req.user?.properties?.flatMap(
        (p: any) => p.permissions || [],
      ),
      timestamp: new Date(),
    };
  }
}
