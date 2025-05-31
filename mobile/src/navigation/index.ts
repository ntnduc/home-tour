export type RootStackParamList = {
  Login: undefined;
  OTPVerification: { phoneNumber: string };
  Register: { phoneNumber: string };
  MainTabs: undefined;
  RoomList: undefined;
  RoomDetail: { roomId: string };
};
