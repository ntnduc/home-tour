import { ApiResponse } from "@/types/api";
import { BasePagingRequest } from "@/types/base.request";
import { BasePagingResponse } from "@/types/base.response";
import {
  ContractDetailResponse,
  ContractListResponse,
  ContractStatus,
} from "@/types/contract";
import { ContractServiceDetailResponse } from "@/types/contract-service";
import { ServiceCalculateMethod } from "@/constant/service.constant";

// ========== MOCK DATA ==========
const mockContracts: ContractDetailResponse[] = [
  {
    id: "contract-1",
    code: "HD-2024-001",
    createdBy: "user-1",
    updatedBy: "user-1",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    propertyId: "prop-1",
    roomId: "room-1",
    startDate: "2024-01-01",
    endDate: null,
    partnerClientCount: 0,
    rentAmountAgreed: 3500000,
    depositAmountPaid: 7000000,
    paymentDueDay: 5,
    contractScanURL: null,
    status: ContractStatus.ACTIVE,
    notes: null,
    room: {
      id: "room-1",
      name: "Phòng 101",
      rentAmount: 3500000,
    },
    property: {
      id: "prop-1",
      name: "Tòa nhà A",
      address: "123 Đường ABC, Quận 1, TP.HCM",
    },
    contractClient: [
      {
        id: "cc-1",
        clientId: "client-1",
        property: {
          id: "client-1",
          fullName: "Nguyễn Văn A",
          phoneNumber: "0901234567",
          email: "nguyenvana@example.com",
        },
        moveInDate: "2024-01-01",
        moveOutDate: null,
        isActiveInContract: true,
      },
    ],
    contractServices: [
      {
        id: "cs-1",
        contractId: "contract-1",
        serviceId: "service-1",
        name: "Điện",
        price: 3500,
        calculationMethod: ServiceCalculateMethod.PER_UNIT_SIMPLE,
        isEnabled: true,
        helperValue: null,
      },
      {
        id: "cs-2",
        contractId: "contract-1",
        serviceId: "service-2",
        name: "Nước",
        price: 15000,
        calculationMethod: ServiceCalculateMethod.PER_UNIT_SIMPLE,
        isEnabled: true,
        helperValue: null,
      },
      {
        id: "cs-3",
        contractId: "contract-1",
        serviceId: "service-3",
        name: "Wifi",
        price: 100000,
        calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
        isEnabled: true,
        helperValue: null,
      },
    ],
  },
  {
    id: "contract-2",
    code: "HD-2024-002",
    createdBy: "user-1",
    updatedBy: "user-1",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    propertyId: "prop-1",
    roomId: "room-2",
    startDate: "2024-01-01",
    endDate: null,
    partnerClientCount: 0,
    rentAmountAgreed: 3200000,
    depositAmountPaid: 6400000,
    paymentDueDay: 5,
    contractScanURL: null,
    status: ContractStatus.ACTIVE,
    notes: null,
    room: {
      id: "room-2",
      name: "Phòng 102",
      rentAmount: 3200000,
    },
    property: {
      id: "prop-1",
      name: "Tòa nhà A",
      address: "123 Đường ABC, Quận 1, TP.HCM",
    },
    contractClient: [
      {
        id: "cc-2",
        clientId: "client-2",
        property: {
          id: "client-2",
          fullName: "Trần Thị B",
          phoneNumber: "0901234568",
          email: "tranthib@example.com",
        },
        moveInDate: "2024-01-01",
        moveOutDate: null,
        isActiveInContract: true,
      },
    ],
    contractServices: [
      {
        id: "cs-4",
        contractId: "contract-2",
        serviceId: "service-1",
        name: "Điện",
        price: 3500,
        calculationMethod: ServiceCalculateMethod.PER_UNIT_SIMPLE,
        isEnabled: true,
        helperValue: null,
      },
      {
        id: "cs-5",
        contractId: "contract-2",
        serviceId: "service-2",
        name: "Nước",
        price: 15000,
        calculationMethod: ServiceCalculateMethod.PER_UNIT_SIMPLE,
        isEnabled: true,
        helperValue: null,
      },
      {
        id: "cs-6",
        contractId: "contract-2",
        serviceId: "service-3",
        name: "Wifi",
        price: 100000,
        calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
        isEnabled: true,
        helperValue: null,
      },
    ],
  },
];

const mockContractList: ContractListResponse[] = mockContracts.map((c) => ({
  id: c.id,
  code: c.code,
  propertyId: c.propertyId,
  roomId: c.roomId,
  landlordUserId: "user-1",
  startDate: c.startDate,
  endDate: c.endDate || undefined,
  rentAmountAgreed: c.rentAmountAgreed,
  depositAmountPaid: c.depositAmountPaid,
  paymentDueDay: c.paymentDueDay,
  contractScanURL: c.contractScanURL || undefined,
  status: c.status,
  notes: c.notes || undefined,
  room: {
    id: c.room.id,
    name: c.room.name,
    property: {
      id: c.property.id,
      name: c.property.name,
      address: c.property.address,
    },
  },
  primaryPropertyUser: {
    id: c.contractClient[0]?.clientId || "user-1",
    fullName: c.contractClient[0]?.property.fullName || "Nguyễn Văn A",
    phone: c.contractClient[0]?.property.phoneNumber || "0901234567",
  },
}));

// ========== MOCK API FUNCTIONS ==========

export const getContractMock = async (
  id: string
): Promise<ApiResponse<ContractDetailResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const contract = mockContracts.find((c) => c.id === id);
  if (contract) {
    return {
      success: true,
      data: contract,
      message: "Success",
    };
  }
  return {
    success: false,
    data: null,
    message: "Contract not found",
  };
};

export const getContractsByRoomMock = async (
  roomId: string,
  queryKey: BasePagingRequest
): Promise<ApiResponse<BasePagingResponse<ContractListResponse>>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let filtered = mockContractList.filter((c) => c.roomId === roomId);

  // Apply status filter
  if (queryKey.filters?.status) {
    filtered = filtered.filter((c) => c.status === queryKey.filters.status);
  }

  return {
    success: true,
    data: {
      items: filtered,
      total: filtered.length,
      limit: queryKey.limit || 10,
      offset: queryKey.offset || 0,
    },
    message: "Success",
  };
};

