import { User } from "./user";

export interface OTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  message: string;
  registrationToken: string;
  isRegistered: boolean;
  accessToken: string;
  refreshToken: string;
  tempToken: string;
  user?: User;
}

export interface RegisterResponse {
  message: string;
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}
