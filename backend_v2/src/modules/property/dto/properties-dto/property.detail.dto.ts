import { BaseDetailDto } from 'src/common/base/dto/detail.dto';
import { Properties } from '../../entities/properties.entity';
import { PropertyServiceDetailDto } from '../properties-service-dto/properties-service.detail.dto';

export class PropertyDetailDto extends BaseDetailDto<Properties> {
  ownerId: string;

  name: string;

  address: string;

  provinceCode: string;

  districtCode: string;

  wardCode: string;

  latitude?: number;

  longitude?: number;
  numberFloor?: number;
  defaultRoomRent: number;
  totalRoom?: number;
  paymentDate: number;
  services: PropertyServiceDetailDto[];

  fromEntity(entity: Properties): void {
    this.id = entity.id;
    this.ownerId = entity.ownerId;
    this.name = entity.name;
    this.address = entity.address;
    this.provinceCode = entity.provinceCode;
    this.districtCode = entity.districtCode;
    this.wardCode = entity.wardCode;
    this.latitude = entity.latitude;
    this.longitude = entity.longitude;
    this.numberFloor = entity.numberFloor;
    this.totalRoom = entity.totalRoom;
    this.defaultRoomRent = entity.defaultRoomRent;
    this.paymentDate = entity.paymentDate;
  }
}
