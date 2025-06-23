import { BaseListDto } from 'src/common/base/dto/list.dto';
import { Properties } from '../entities/properties.entity';

export class PropertyListDto extends BaseListDto<Properties> {
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
  }
  ownerId: string;

  name: string;

  address: string;

  provinceCode: string;

  districtCode: string;

  wardCode: string;

  latitude?: number;

  longitude?: number;
}
