import { BaseUpdateDto } from 'src/common/base/dto/update.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Properties } from '../../entities/properties.entity';

export class PropertyUpdateDto extends BaseUpdateDto<Properties> {
  ownerId: string;

  name: string;

  address: string;

  provinceCode: string;

  districtCode: string;

  wardCode: string;

  latitude?: number;

  longitude?: number;

  getEntity(entity: Properties): QueryDeepPartialEntity<Properties> {
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
