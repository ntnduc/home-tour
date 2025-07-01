import { Contract } from "@/types/contract";
import { Invoice } from "@/types/payment";

export type RootStackParamList = {
  Login: undefined;
  OTPVerification: { phoneNumber: string };
  Register: { registrationToken: string };
  MainTabs: undefined;
  RoomList: undefined;
  RoomDetail: { roomId: string };
  CreateTenant: undefined;
  UpdateRoom: { room: any };
  InvoiceDetail: { invoice: Invoice; fromHistory?: boolean };
  InvoiceHistory: undefined;
  // Contract management routes
  CreateContract: { room: any };
  ContractDetail: { contract: Contract };
  ContractList: undefined;
  TerminateContract: { contract: Contract };
  UpdateTenant: { tenantId: string };
};

export type TabParamList = {
  Home: undefined;
  RoomList: undefined;
  ContractList: undefined;
  Profile: undefined;
};
