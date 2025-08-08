import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/crud/base.controller';
import { StickAuthGaurd } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { PropertyAccessGuard } from '../rbac/guards/property-access.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { RoomDetailDto } from './dto/room-dto/room.detail.dto';
import { RoomListDto } from './dto/room-dto/room.list.dto';
import { RoomUpdateDto } from './dto/room-dto/room.update.dto';
import { RoomCreateDto } from './dto/room-dto/rooms.create.dto';
import { Rooms } from './entities/rooms.entity';
import { RoomsService } from './rooms.service';

@ApiTags('Room')
@ApiBearerAuth()
@Controller('api/rooms')
@UseGuards(StickAuthGaurd, RolesGuard, PermissionsGuard, PropertyAccessGuard)
export class RoomsController extends BaseController<
  RoomsService,
  Rooms,
  RoomDetailDto,
  RoomListDto,
  RoomCreateDto,
  RoomUpdateDto
> {
  constructor(private readonly roomsService: RoomsService) {
    super(
      roomsService,
      RoomDetailDto,
      RoomListDto,
      RoomCreateDto,
      RoomUpdateDto,
    );
  }
}
