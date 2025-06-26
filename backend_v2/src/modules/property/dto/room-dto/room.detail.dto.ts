import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseDetailDto } from 'src/common/base/dto/detail.dto';
import { Rooms } from '../../entities/rooms.entity';
import { PropertyDetailDto } from '../properties-dto/property.detail.dto';

export class RoomDetailDto extends BaseDetailDto<Rooms> {
  @IsOptional()
  @ValidateNested()
  @Type(() => PropertyDetailDto)
  property?: PropertyDetailDto;

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
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;
  }
}
