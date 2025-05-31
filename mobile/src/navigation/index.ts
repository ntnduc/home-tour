export type RootStackParamList = {
  Login: undefined;
  OTPVerification: { phoneNumber: string };
  Register: { registrationToken: string };
  MainTabs: undefined;
  RoomList: undefined;
  RoomDetail: { roomId: string };
};

export type TabParamList = {
  Home: undefined;
  RoomList: undefined;
  Profile: undefined;
};
