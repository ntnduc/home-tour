import { BaseDetailDto } from '../../../../common/base/dto/detail.dto';
import { ContractStatus } from '../../../../common/enums/contract.enum';
import { Contracts } from '../../entities/contracts.entity';

export class ContractDetailDto extends BaseDetailDto<Contracts> {
  propertyId: string;
  roomId: string;
  code: string;
  partnerClientCount?: number;
  isPrepaidRoom?: boolean;
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
  primaryPropertyUser: {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
  };
  landlord: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email?: string;
  };
  property: {
    id: string;
    name: string;
    address: string;
  };
  startDate: Date;
  endDate?: Date;
  rentAmountAgreed: number;
  depositAmountPaid: number;
  paymentDueDay: number;
  contractScanURL?: string;
  status: ContractStatus;
  notes?: string;
  contractClient: Array<{
    id: string;
    clientId: string;
    property: {
      id: string;
      fullName: string;
      phoneNumber: string;
      email?: string;
    };
    moveInDate?: Date;
    moveOutDate?: Date;
    isActiveInContract: boolean;
  }>;
  contractServices: Array<{
    id: string;
    price?: number;
    name?: string;
    isEnabled: boolean;
    notes?: string;
  }>;

  fromEntity(entity: Contracts): void {
    this.id = entity.id;
    this.propertyId = entity.propertyId;
    this.roomId = entity.roomId;
    this.partnerClientCount = entity.partnerClientCount;
    this.isPrepaidRoom = entity.isPrepaidRoom;
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
    if (entity.property) {
      this.property = {
        id: entity.property?.id || '',
        name: entity.property?.name || '',
        address: entity.property?.address || '',
      };
    }

    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.rentAmountAgreed = entity.rentAmountAgreed
      ? Number(entity.rentAmountAgreed)
      : 0;
    this.depositAmountPaid = entity.depositAmountPaid
      ? Number(entity.depositAmountPaid)
      : 0;
    this.paymentDueDay = entity.paymentDueDay;
    this.contractScanURL = entity.contractScanURL;
    this.status = entity.status;
    this.notes = entity.notes;
    this.contractClient =
      entity.contractClient?.map((lp) => ({
        id: lp.id,
        clientId: lp.clientId,
        property: {
          id: lp.client?.id || '',
          fullName: lp.client?.fullName || '',
          phoneNumber: lp.client?.phoneNumber || '',
          email: lp.client?.email,
        },
        moveInDate: lp.moveInDate,
        moveOutDate: lp.moveOutDate,
        isActiveInContract: lp.isActiveInContract,
      })) || [];
    this.contractServices =
      entity.contractServices?.map((ls) => ({
        id: ls.id,
        price: ls.price,
        isEnabled: ls.isEnabled,
        notes: ls.notes,
        name: ls.name,
      })) || [];
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;
    this.code = entity.code;
  }
}
