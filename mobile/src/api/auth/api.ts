import { privateApi, publicApi } from "@/services/api";
import { VerifyOTPResponse } from "@/types/auth";
import { createSuccessResponse, handleApiError } from "@/utils/apiUtil";
import { storage } from "@/utils/storage";

export const requestOTP = async (phoneNumber: string) => {
  try {
    const response = await publicApi.post("/auth/request-otp", { phoneNumber });
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gửi request OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (phoneNumber: string, otp: string) => {
  try {
    const response = await publicApi.post("/auth/verify-otp", {
      phoneNumber,
      otp,
    });
    return createSuccessResponse<VerifyOTPResponse>(response.data.data);
  } catch (error) {
    console.error("verifyOTP:", JSON.stringify(error));
    throw handleApiError(error);
  }
};

export const register = async (registrationToken: string, fullname: string) => {
  try {
    const response = await publicApi.post("/auth/register", {
      fullname,
      registrationToken,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const login = async (phoneNumber: string, otp: string) => {
  const response = await publicApi.post("/auth/login", {
    phoneNumber,
    otp,
  });
  return response.data;
};

export const logout = async () => {
  try {
    await privateApi.post("/auth/logout");
  } catch (error) {
    console.error("logout:", JSON.stringify(error));
  }
  await storage.clearAll();
};
