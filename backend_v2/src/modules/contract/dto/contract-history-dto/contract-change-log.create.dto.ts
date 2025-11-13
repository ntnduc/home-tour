import { IsString } from 'class-validator';
import { BaseCreateDto } from 'src/common/base/dto/create.dto';
import { ContractChangeLog } from '../../entities/contract-change-log.entity';
import { ContractChangeDetailCreateDto } from './contract-change-detail.create.dto';

export class ContractChangeLogCreateDto extends BaseCreateDto<ContractChangeLog> {
  contractId: string;

  @IsString()
  changeType: string;

  @IsString()
  changeReason: string;

  contractChangeDetails: ContractChangeDetailCreateDto[];

  getEntity(): ContractChangeLog {
    const entity = new ContractChangeLog();
    entity.contractId = this.contractId;
    entity.changeType = this.changeType;
    entity.changeReason = this.changeReason;
    entity.contractChangeDetails = this.contractChangeDetails.map((detail) =>
      detail.getEntity(),
    );
    return entity;
  }
}
