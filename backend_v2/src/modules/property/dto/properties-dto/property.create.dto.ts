import { Type } from 'class-transformer';
import {
  isNumber,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { BaseCreateDto } from 'src/common/base/dto/create.dto';
import { CreateServiceDto } from 'src/modules/services/dto/services.create.dto';
import { Properties } from '../../entities/properties.entity';

export class PropertyCreateDto extends BaseCreateDto<Properties> {
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

  @IsNumber()
  defaultRoomRent: number;

  @IsNumber()
  @IsOptional()
  numberFloor?: number;

  @IsNumber()
  totalRoom: number;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Ngày thanh toán không hợp lệ!' })
  @Max(31, { message: 'Ngày thanh toán không hợp lệ!' })
  paymentDate?: number;

  getEntity(): Properties {
    const entity = new Properties();
    entity.name = this.name;
    entity.address = this.address;
    entity.provinceCode = this.provinceCode;
    entity.districtCode = this.districtCode;
    entity.wardCode = this.wardCode;
    entity.latitude = isNumber(this.latitude)
      ? parseInt(this.latitude)
      : undefined;
    entity.longitude = isNumber(this.longitude)
      ? parseInt(this.longitude)
      : undefined;
    entity.defaultRoomRent = this.defaultRoomRent;
    entity.numberFloor = this.numberFloor;
    entity.totalRoom = this.totalRoom;
    entity.paymentDate = this.paymentDate ?? 5;
    return entity;
  }
}
