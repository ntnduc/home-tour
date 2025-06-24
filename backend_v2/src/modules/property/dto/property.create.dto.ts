import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseCreateDto } from 'src/common/base/dto/create.dto';
import { CreateServiceDto } from 'src/modules/services/dto/services.create.dto';
import { Properties } from '../entities/properties.entity';

export class PropertyCreateDto extends BaseCreateDto<Properties> {
  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  provinceCode: string;

  @IsString()
  districtCode: string;

  @IsString()
  wardCode: string;

  @IsString()
  @IsOptional()
  latitude?: string;

  @IsString()
  @IsOptional()
  longitude?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateServiceDto)
  services?: Array<CreateServiceDto>;

  getEntity(): Properties {
    const entity = new Properties();
    entity.ownerId = this.ownerId ?? '';
    entity.name = this.name;
    entity.address = this.address;
    entity.provinceCode = this.provinceCode;
    entity.districtCode = this.districtCode;
    entity.wardCode = this.wardCode;
    entity.latitude = parseInt(this.latitude ?? 'null') ?? null;
    entity.longitude = parseInt(this.longitude ?? 'null') ?? null;
    return entity;
  }
}
