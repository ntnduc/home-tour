import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDetailDto } from 'src/common/base/dto/detail.dto';
import { PropertiesService } from 'src/modules/property/entities/properties-service.entity';
import { ContractServices } from '../../entities/contract-services.entity';

export class ContractServiceDetailDto extends BaseDetailDto<ContractServices> {
  @IsString()
  contractId: string;

  @IsString()
  propertyServiceId: string;

  @IsNumber()
  price: number;

  @IsString()
  calculationMethod: string;

  @IsBoolean()
  isEnabled: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  name?: string;

  fromEntity(entity: ContractServices): void {
    this.id = entity.id;
    this.propertyServiceId = entity.propertyServiceId;
    this.price = entity.price;
    this.calculationMethod = entity.calculationMethod;
    this.isEnabled = entity.isEnabled;
    this.notes = entity.notes;
    if (entity.propertyService) {
      this.name = entity.propertyService.name;
    }
  }

  fromPropertyService(propertyService: PropertiesService): void {
    this.name = propertyService.name;
    this.price = propertyService.price;
    this.calculationMethod = propertyService.calculationMethod;
    this.isEnabled = true;
    this.propertyServiceId = propertyService.id;
  }
}
