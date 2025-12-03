import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContractStatus } from 'src/common/enums/contract.enum';

export class ContractChangeStatusDto {
  @IsString()
  id: string;

  @IsEnum(ContractStatus)
  status: ContractStatus;

  @IsString()
  @IsOptional()
  reason: string;
}
