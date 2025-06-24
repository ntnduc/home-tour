import { BaseCreateDto } from 'src/common/base/dto/create.dto';
import { Properties } from '../entities/properties.entity';

export class PropertyCreateDto extends BaseCreateDto<Properties> {
  ownerId: string;
  name: string;
  address: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  latitude?: number;
  longitude?: number;

  getEntity(): Properties {
    const entity = new Properties();
    entity.ownerId = this.ownerId;
    entity.name = this.name;
    entity.address = this.address;
    entity.provinceCode = this.provinceCode;
    entity.districtCode = this.districtCode;
    entity.wardCode = this.wardCode;
    entity.latitude = this.latitude;
    entity.longitude = this.longitude;
    return entity;
  }
}
