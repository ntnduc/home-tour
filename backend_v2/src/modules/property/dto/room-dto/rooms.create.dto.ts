import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseCreateDto } from 'src/common/base/dto/create.dto';
import { RoomStatus } from 'src/common/enums/room.enum';
import { Rooms } from '../../entities/rooms.entity';

export class RoomCreateDto extends BaseCreateDto<Rooms> {
  @IsString()
  name: string;

  @IsString()
  status: RoomStatus;

  @IsNumber()
  @IsOptional()
  area?: number;

  @IsNumber()
  rentAmount: number;

  @IsNumber()
  @IsOptional()
  maxOccupancy?: number;

  @IsString()
  @IsOptional()
  floor?: string;

  @IsNumber()
  defaultDepositAmount: number;

  @IsNumber()
  defaultPaymentDueDay: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  propertyId: string;

  getEntity(): Rooms {
    const entity = new Rooms();
    entity.name = this.name;
    entity.status = this.status;
    entity.area = this.area;
    entity.rentAmount = this.rentAmount;
    entity.maxOccupancy = this.maxOccupancy;
    entity.floor = this.floor;
    entity.defaultDepositAmount = this.defaultDepositAmount;
    entity.defaultPaymentDueDay = this.defaultPaymentDueDay;
    entity.description = this.description;
    entity.propertyId = this.propertyId;
    return entity;
  }
}
