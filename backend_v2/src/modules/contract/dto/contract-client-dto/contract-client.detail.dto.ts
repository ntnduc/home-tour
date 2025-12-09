import { BaseDetailDto } from '../../../../common/base/dto/detail.dto';
import { ContractClient } from '../../entities/contract-client.entity';

export class ContractClientDetailDto extends BaseDetailDto<ContractClient> {
  name: string;
  isLandlordClient: boolean;
  moveInDate?: Date;
  moveOutDate?: Date;
  isActiveInContract: boolean;

  fromEntity(entity: ContractClient): void {
    this.id = entity.id;
    this.name = entity.name;
    this.isLandlordClient = entity.isLandlordClient;
    this.moveInDate = entity.moveInDate;
    this.moveOutDate = entity.moveOutDate;
    this.isActiveInContract = entity.isActiveInContract;
  }
}
