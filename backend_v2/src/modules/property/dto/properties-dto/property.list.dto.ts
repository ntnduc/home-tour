import { BaseListDto } from 'src/common/base/dto/list.dto';
import { PropertyRoomsStatus } from 'src/common/enums/property.enum';
import { RoomStatus } from 'src/common/enums/room.enum';
import { Properties } from '../../entities/properties.entity';

export class PropertyListDto extends BaseListDto<Properties> {
  fromEntity(entity: Properties): void {
    this.id = entity.id;
    this.ownerId = entity.ownerId;
    this.name = entity.name;
    this.numberFloor = entity.numberFloor;
    this.totalRoom = entity?.rooms?.length || 0;
    this.paymentDate = entity.paymentDate;
    this.totalRoomOccupied = entity?.rooms?.filter(
      (room) => room.status === RoomStatus.OCCUPIED,
    ).length;
  }
  ownerId: string;

  name: string;

  address: string;

  numberFloor?: number;

  totalRoom: number;
  totalRoomOccupied?: number;

  paymentDate: number;

  statusRooms: PropertyRoomsStatus;
}
