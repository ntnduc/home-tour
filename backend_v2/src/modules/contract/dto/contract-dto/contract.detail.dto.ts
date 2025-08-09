import { BaseDetailDto } from '../../../../common/base/dto/detail.dto';
import { ContractStatus } from '../../../../common/enums/contract.enum';
import { Contracts } from '../../entities/contracts.entity';

export class ContractDetailDto extends BaseDetailDto<Contracts> {
  propertyId: string;
  roomId: string;
  room: {
    id: string;
    name: string;
    area?: number;
    rentAmount: number;
    maxOccupancy?: number;
    floor?: string;
    property: {
      id: string;
      name: string;
      address: string;
    };
  };
  primaryTenantUserId: string;
  primaryTenant: {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
  };
  landlordUserId: string;
  landlord: {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
  };
  startDate: Date;
  endDate?: Date;
  rentAmountAgreed: number;
  depositAmountPaid: number;
  paymentDueDay: number;
  contractScanURL?: string;
  status: ContractStatus;
  notes?: string;
  contractProperties: Array<{
    id: string;
    propertyUserId: string;
    property: {
      id: string;
      fullName: string;
      phone: string;
      email?: string;
    };
    moveInDate?: Date;
    moveOutDate?: Date;
    isActiveInContract: boolean;
  }>;
  contractServices: Array<{
    id: string;
    serviceId: string;
    service: {
      id: string;
      name: string;
      icon?: string;
    };
    customPrice?: number;
    isEnabled: boolean;
    notes?: string;
  }>;

  fromEntity(entity: Contracts): void {
    this.id = entity.id;
    this.propertyId = entity.propertyId;
    this.roomId = entity.roomId;
    this.room = {
      id: entity.room?.id || '',
      name: entity.room?.name || '',
      area: entity.room?.area,
      rentAmount: entity.room?.rentAmount || 0,
      maxOccupancy: entity.room?.maxOccupancy,
      floor: entity.room?.floor,
      property: {
        id: entity.room?.property?.id || '',
        name: entity.room?.property?.name || '',
        address: entity.room?.property?.address || '',
      },
    };
    this.primaryTenantUserId = entity.primaryTenantUserId;
    this.primaryTenant = {
      id: entity.primaryTenant?.id || '',
      fullName: entity.primaryTenant?.fullName || '',
      phone: entity.primaryTenant?.phone || '',
      email: entity.primaryTenant?.email,
    };
    this.landlordUserId = entity.landlordUserId;
    this.landlord = {
      id: entity.landlord?.id || '',
      fullName: entity.landlord?.fullName || '',
      phone: entity.landlord?.phone || '',
      email: entity.landlord?.email,
    };
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.rentAmountAgreed = entity.rentAmountAgreed;
    this.depositAmountPaid = entity.depositAmountPaid;
    this.paymentDueDay = entity.paymentDueDay;
    this.contractScanURL = entity.contractScanURL;
    this.status = entity.status;
    this.notes = entity.notes;
    this.contractProperties =
      entity.contractProperties?.map((lp) => ({
        id: lp.id,
        propertyUserId: lp.propertyUserId,
        property: {
          id: lp.property?.id || '',
          fullName: lp.property?.fullName || '',
          phone: lp.property?.phone || '',
          email: lp.property?.email,
        },
        moveInDate: lp.moveInDate,
        moveOutDate: lp.moveOutDate,
        isActiveInContract: lp.isActiveInContract,
      })) || [];
    this.contractServices =
      entity.contractServices?.map((ls) => ({
        id: ls.id,
        serviceId: ls.serviceId,
        service: {
          id: ls.service?.id || '',
          name: ls.service?.name || '',
          icon: ls.service?.icon,
        },
        customPrice: ls.customPrice,
        isEnabled: ls.isEnabled,
        notes: ls.notes,
      })) || [];
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;
  }
}
