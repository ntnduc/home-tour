export type RootStackParamList = {
  Login: undefined;
  OTPVerification: { phoneNumber: string };
  Register: { registrationToken: string };
  MainTabs: undefined;
  CreateTenant: undefined;
  InvoiceDetail: { invoice: any };
  InvoiceHistory: undefined;
};
