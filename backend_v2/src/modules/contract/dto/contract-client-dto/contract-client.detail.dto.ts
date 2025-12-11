import { BaseDetailDto } from '../../../../common/base/dto/detail.dto';
import { ContractClient } from '../../entities/contract-client.entity';

export class ContractClientDetailDto extends BaseDetailDto<ContractClient> {
  name: string;
  isLandlordClient: boolean;
  phoneNumber?: string;
  moveInDate?: Date;
  moveOutDate?: Date;
  isActiveInContract: boolean;

  fromEntity(entity: ContractClient): void {
    this.id = entity.id;
    this.name = entity.name;
    if (entity.client) {
      this.phoneNumber = entity.client.phoneNumber;
    }
    this.isLandlordClient = entity.isLandlordClient;
    this.moveInDate = entity.moveInDate;
    this.moveOutDate = entity.moveOutDate;
    this.isActiveInContract = entity.isActiveInContract;
  }
}
