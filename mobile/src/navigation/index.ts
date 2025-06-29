import { Invoice } from "@/types/payment";

export type RootStackParamList = {
  Login: undefined;
  OTPVerification: { phoneNumber: string };
  Register: { registrationToken: string };
  MainTabs: undefined;
  RoomList: undefined;
  RoomDetail: { roomId: string };
  CreateTenant: undefined;
  InvoiceDetail: { invoice: Invoice; fromHistory?: boolean };
  InvoiceHistory: undefined;
};

export type TabParamList = {
  Home: undefined;
  RoomList: undefined;
  Profile: undefined;
};
