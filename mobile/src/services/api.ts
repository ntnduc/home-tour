import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const requestOTP = async (phoneNumber: string) => {
  try {
    console.log("🚀 Gửi request OTP cho số:", phoneNumber);
    const response = await api.post("/api/auth/request-otp", { phoneNumber });
    console.log("✅ Response từ server:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gửi request OTP:", error);
    throw error;
  }
};

export default api;
