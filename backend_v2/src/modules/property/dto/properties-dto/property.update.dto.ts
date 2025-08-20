import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { BaseUpdateDto } from 'src/common/base/dto/update.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Properties } from '../../entities/properties.entity';
import { PropertiesCreateOrUpdateDto } from '../properties-service-dto/properties-create-or-update.dto';

export class PropertyUpdateDto extends BaseUpdateDto<Properties> {
  ownerId: string;

  name: string;

  address: string;

  provinceCode: string;

  districtCode: string;

  wardCode: string;

  latitude?: number;

  longitude?: number;

  numberFloor?: number;

  totalRoom: number;

  defaultRoomRent: number;

  paymentDate: number;

  @ValidateNested({ each: true })
  @Type(() => PropertiesCreateOrUpdateDto)
  services?: PropertiesCreateOrUpdateDto[];

  removeServiceIds?: string[];

  getEntity(entity: Properties): QueryDeepPartialEntity<Properties> {
    entity.ownerId = this.ownerId;
    entity.name = this.name;
    entity.address = this.address;
    entity.provinceCode = this.provinceCode;
    entity.districtCode = this.districtCode;
    entity.wardCode = this.wardCode;
    entity.latitude = this.latitude;
    entity.longitude = this.longitude;
    entity.numberFloor = this.numberFloor;
    entity.totalRoom = this.totalRoom;
    entity.defaultRoomRent = this.defaultRoomRent;
    entity.paymentDate = this.paymentDate;
    return entity;
  }
}
