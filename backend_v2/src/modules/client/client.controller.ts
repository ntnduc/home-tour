import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/crud/base.controller';
import { AutoCrudPermissions } from '../../common/decorators/crud-permissions.decorator';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../rbac/decorators/roles.decorator';
import { ClientService } from './client.service';
import { ClientCreateDto } from './dto/client.create.dto';
import { ClientDetailDto } from './dto/client.detail.dto';
import { ClientListDto } from './dto/client.list.dto';
import { ClientUpdateDto } from './dto/client.update.dto';
import { Client } from './entities/client.entity';

@ApiTags('Client')
@ApiBearerAuth()
@Controller('api/client')
@Roles(Role.ADMIN, Role.OWNER, Role.PROPERTY_MANAGER, Role.ACCOUNTANT)
@AutoCrudPermissions('CLIENT')
export class ClientController extends BaseController<
  ClientService,
  Client,
  ClientDetailDto,
  ClientListDto,
  ClientCreateDto,
  ClientUpdateDto
> {
  constructor(private readonly clientService: ClientService) {
    super(
      clientService,
      ClientDetailDto,
      ClientListDto,
      ClientCreateDto,
      ClientUpdateDto,
    );
  }
}

