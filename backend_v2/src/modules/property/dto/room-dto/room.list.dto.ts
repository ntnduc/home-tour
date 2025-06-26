import { IsNumber, IsString } from 'class-validator';
import { BaseListDto } from 'src/common/base/dto/list.dto';
import { Rooms } from '../../entities/rooms.entity';

export class RoomListDto extends BaseListDto<Rooms> {
  @IsString()
  propertyId: string;

  @IsString()
  name: string;

  @IsString()
  status: string;

  @IsNumber()
  area?: number;

  @IsNumber()
  rentAmount: number;

  @IsNumber()
  maxOccupancy?: number;

  @IsString()
  floor?: string;

  @IsNumber()
  defaultDepositAmount: number;

  @IsNumber()
  defaultPaymentDueDay: number;

  @IsString()
  description?: string;

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
  }
}
