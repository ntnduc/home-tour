import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/base/crud/base.service';
import { RoomStatus } from 'src/common/enums/room.enum';
import { SelectQueryBuilder } from 'typeorm';
import { PropertyCreateDto } from './dto/properties-dto/property.create.dto';
import { PropertyDetailDto } from './dto/properties-dto/property.detail.dto';
import { RoomServiceDetailDto } from './dto/room-dto/room-service.detail.dto';
import { RoomDetailDto } from './dto/room-dto/room.detail.dto';
import { RoomListDto } from './dto/room-dto/room.list.dto';
import { RoomUpdateDto } from './dto/room-dto/room.update.dto';
import { RoomCreateDto } from './dto/room-dto/rooms.create.dto';
import { Rooms } from './entities/rooms.entity';
import { RoomsRepository } from './repositories/rooms.repository';

@Injectable()
export class RoomsService extends BaseService<
  Rooms,
  RoomDetailDto,
  RoomListDto,
  RoomCreateDto,
  RoomUpdateDto
> {
  constructor(private readonly roomsRepository: RoomsRepository) {
    super(
      roomsRepository,
      RoomDetailDto,
      RoomListDto,
      RoomCreateDto,
      RoomUpdateDto,
    );
  }

  override async specQuery(): Promise<SelectQueryBuilder<Rooms>> {
    const query = this.roomsRepository.createQueryBuilder('entity');

    query.orderBy('property.name', 'ASC');
    return query;
  }

  override beautifyResult(items: Rooms[]): Promise<RoomListDto[]> {
    items.sort((a, b) => {
      const propCompare = a.property.name.localeCompare(b.property.name);
      if (propCompare !== 0) return propCompare;
      return a.name.localeCompare(b.name);
    });
    return super.beautifyResult(items);
  }

  override async get(id: string): Promise<RoomDetailDto> {
    const entity = await this.genericRepository.findOne({
      where: {
        id: id as any,
      },
    });

    if (!entity) {
      throw new NotFoundException('Không tìm thấy dữ liệu!');
    }

    const dto = new RoomDetailDto();
    dto.fromEntity(entity);
    if (entity.property) {
      const property = new PropertyDetailDto();
      property.fromEntity(entity.property);
      dto.property = property;
    }

    return dto;
  }

  public async getRoomServices(id: string): Promise<RoomServiceDetailDto> {
    const entity = await this.genericRepository.findOne({
      where: { id: id as any },
      relations: ['property', 'property.services', 'property.services.service'],
    });

    if (!entity) {
      throw new NotFoundException('Không tìm thấy phòng!');
    }

    const dto = new RoomServiceDetailDto();
    dto.fromEntity(entity);
    return dto;
  }

  public getRoomsDefaultFromTotalNumberRooms(
    property: PropertyCreateDto,
  ): RoomCreateDto[] {
    const rooms: RoomCreateDto[] = [];
    const numberFloor = property.numberFloor;
    const totalRoom = property.totalRoom;
    if (numberFloor && numberFloor > 0) {
      // Trường hợp có số tầng
      const baseRoomPerFloor = Math.floor(totalRoom / numberFloor);
      let remainingRooms = totalRoom % numberFloor;

      let roomNumber = 1;

      for (let floor = 1; floor <= numberFloor; floor++) {
        // Nếu còn phòng thừa, tầng này sẽ có thêm 1 phòng
        let roomsOnThisFloor = baseRoomPerFloor + (remainingRooms > 0 ? 1 : 0);
        if (remainingRooms > 0) remainingRooms--;

        for (let i = 0; i < roomsOnThisFloor; i++) {
          const room = new RoomCreateDto();
          room.name = `Phòng ${roomNumber}`;
          room.floor = floor.toString();
          room.status = RoomStatus.AVAILABLE;
          room.rentAmount = property.defaultRoomRent;
          room.defaultDepositAmount = property.defaultRoomRent;
          room.defaultPaymentDueDay = property.paymentDate ?? 5;
          rooms.push(room);
          roomNumber++;
        }
      }
    } else {
      // Trường hợp không có số tầng, tất cả floor là null
      for (let i = 1; i <= totalRoom; i++) {
        const room = new RoomCreateDto();
        room.name = `Phòng ${i}`;
        room.status = RoomStatus.AVAILABLE;
        room.rentAmount = property.defaultRoomRent;
        room.defaultDepositAmount = property.defaultRoomRent;
        room.defaultPaymentDueDay = property.paymentDate ?? 5;
        rooms.push(room);
      }
    }
    return rooms;
  }
}
