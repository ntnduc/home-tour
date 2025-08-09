import { IsNumber, IsString } from 'class-validator';
import { BaseDetailDto } from 'src/common/base/dto/detail.dto';
import { Rooms } from '../../entities/rooms.entity';
import { PropertyDetailDto } from '../properties-dto/property.detail.dto';
import { PropertyServiceDetailDto } from '../properties-service-dto/properties-service.detail.dto';

export class RoomServiceDetailDto extends BaseDetailDto<Rooms> {
  @IsString()
  name: string;

  @IsString()
  status: string;
  services: PropertyServiceDetailDto[];

  @IsString()
  propertyId: string;

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

  property: PropertyDetailDto;

  fromEntity(entity: Rooms): void {
    this.id = entity.id;
    this.name = entity.name;
    this.status = entity.status;
    this.propertyId = entity.propertyId;
    this.area = entity.area;
    this.rentAmount = entity.rentAmount;
    this.maxOccupancy = entity.maxOccupancy;
    this.floor = entity.floor;
    this.defaultDepositAmount = entity.defaultDepositAmount;
    this.defaultPaymentDueDay = entity.defaultPaymentDueDay;
    this.description = entity.description;
    if (entity.property) {
      const property = new PropertyDetailDto();
      property.fromEntity(entity.property);
      this.property = property;
    }
    if (
      entity.property &&
      entity.property.services &&
      entity.property.services.length > 0
    ) {
      this.services = entity.property.services.map((service) => {
        const serviceDetailDto = new PropertyServiceDetailDto();
        serviceDetailDto.fromEntity(service);
        return serviceDetailDto;
      });
    }
  }
}
