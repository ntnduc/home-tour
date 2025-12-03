import { Contract, ContractCreateRequest } from "@/types/contract";
import { Invoice } from "@/types/payment";
import { Room } from "@/types/room";

export type RootStackParamList = {
  // Auth Flow
  Login: undefined;
  OTPVerification: { phoneNumber: string };
  Register: { registrationToken: string };

  // Main App
  MainTabs: undefined;

  // Property Management
  PropertyList: undefined;
  PropertyDetail: { propertyId: string };
  CreateProperty: undefined;
  UpdateProperty: { propertyId: string };

  // Room Management
  RoomList: { propertyId?: string };
  RoomDetail: { roomId: string };
  CreateRoom: { propertyId: string };
  UpdateRoom: { roomId: string; room: Room };

  // Tenant Management
  TenantList: undefined;
  TenantDetail: { tenantId: string };
  CreateTenant: { roomId?: string };
  UpdateTenant: { tenantId: string };

  // Contract Management
  ContractList: undefined;
  ContractDetail: { contractId: string };
  CreateContract: { roomId: string; tenantId?: string };
  ConfirmCreateContract: {
    contract: ContractCreateRequest;
    room: string;
    property: string;
  };
  TerminateContract: { contract: Contract };

  // Invoice Management
  InvoiceDetail: { invoice: Invoice; fromHistory?: boolean };
  InvoiceHistory: undefined;
  CreateInvoice: { contractId: string };

  // Reports
  ReportDashboard: undefined;

  // Profile
  Profile: undefined;

  // Test
  TestScreen: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Properties: undefined;
  Rooms: undefined;
  Contracts: undefined;
  Reports: undefined;
  Profile: undefined;
  TestScreen: undefined;
};
