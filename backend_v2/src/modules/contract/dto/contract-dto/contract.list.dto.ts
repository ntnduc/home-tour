import { BaseListDto } from '../../../../common/base/dto/list.dto';
import { ContractStatus } from '../../../../common/enums/contract.enum';
import { Contracts } from '../../entities/contracts.entity';

export class ContractListDto extends BaseListDto<Contracts> {
  propertyId: string;
  roomId: string;
  roomName: string;
  propertyName: string;
  primaryTenantName: string;
  primaryTenantPhone: string;
  landlordName: string;
  startDate: Date;
  endDate?: Date;
  rentAmountAgreed: number;
  depositAmountPaid: number;
  paymentDueDay: number;
  status: ContractStatus;
  totalProperties: number;
  createdAt: Date;
  updatedAt: Date;

  fromEntity(entity: Contracts): void {
    this.id = entity.id;
    this.propertyId = entity.propertyId;
    this.roomId = entity.roomId;
    this.roomName = entity.room?.name || '';
    this.propertyName = entity.room?.property?.name || '';
    this.primaryTenantName = entity.primaryTenant?.fullName || '';
    this.primaryTenantPhone = entity.primaryTenant?.phone || '';
    this.landlordName = entity.landlord?.fullName || '';
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.rentAmountAgreed = entity.rentAmountAgreed;
    this.depositAmountPaid = entity.depositAmountPaid;
    this.paymentDueDay = entity.paymentDueDay;
    this.status = entity.status;
    this.totalProperties =
      entity.contractProperties?.filter((p) => p.isActiveInContract).length || 0;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
