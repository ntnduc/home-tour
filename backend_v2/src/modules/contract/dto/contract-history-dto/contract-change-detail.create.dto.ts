import { IsString } from 'class-validator';
import { BaseCreateDto } from 'src/common/base/dto/create.dto';
import { ContractChangeDetail } from '../../entities/contract-change-detail.entity';

export class ContractChangeDetailCreateDto extends BaseCreateDto<ContractChangeDetail> {
  @IsString()
  contractId: string;

  @IsString()
  changeLogId: string;

  @IsString()
  field: string;

  oldValue: any;

  newValue: any;

  getEntity(): ContractChangeDetail {
    const entity = new ContractChangeDetail();
    entity.contractId = this.contractId;
    entity.changeLogId = this.changeLogId;
    entity.field = this.field;
    entity.oldValue = JSON.stringify(this.oldValue);
    entity.newValue = JSON.stringify(this.newValue);
    return entity;
  }
}
