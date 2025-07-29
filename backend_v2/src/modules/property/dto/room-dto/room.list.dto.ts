import { BaseListDto } from 'src/common/base/dto/list.dto';
import { Rooms } from '../../entities/rooms.entity';
import { PropertyDetailDto } from '../properties-dto/property.detail.dto';

export class RoomListDto extends BaseListDto<Rooms> {
  propertyId: string;
  name: string;
  status: string;
  area?: number;
  rentAmount: number;
  maxOccupancy?: number;
  floor?: string;
  defaultDepositAmount: number;
  defaultPaymentDueDay: number;
  description?: string;
  property?: PropertyDetailDto;

  fromEntity(entity: Rooms): void {
    this.id = entity.id;
    this.propertyId = entity.propertyId;
    this.name = entity.name;
    this.status = entity.status;
    this.area = entity.area;
    this.rentAmount = entity.rentAmount;
    this.maxOccupancy = entity.maxOccupancy;
    this.floor = entity.floor;
    this.defaultDepositAmount = entity.defaultDepositAmount;
    this.defaultPaymentDueDay = entity.defaultPaymentDueDay;
    this.description = entity.description;
    if (entity.property) {
      const propertyDto = new PropertyDetailDto();
      propertyDto.fromEntity(entity.property);
      this.property = propertyDto;
    }
  }
}
