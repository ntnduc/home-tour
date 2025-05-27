import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

// Kiểm tra các biến môi trường bắt buộc
const requiredEnvVars = [
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Khởi tạo Twilio client
const client = twilio(accountSid, authToken);

export class OTPService {
  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(phoneNumber: string): Promise<string> {
    const otp = this.generateOTP();

    try {
      // Gửi SMS thông qua Twilio
      await client.messages.create({
        body: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });

      return otp;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new Error("Không thể gửi mã OTP. Vui lòng thử lại sau.");
    }
  }

  static verifyOTP(providedOTP: string, originalOTP: string): boolean {
    return providedOTP === originalOTP;
  }
}
