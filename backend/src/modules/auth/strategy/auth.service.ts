import { Token } from "@/entities/Token";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { OTP } from "../../entities/OTP";
import { UsersService } from "../users/users.service";
import { RequestRegisterDto, RequestVerifyOTP } from "./dto/AuthDto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>
  ) {}

  private formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Nếu số điện thoại bắt đầu bằng 0, thay thế bằng +84
    if (cleaned.startsWith("0")) {
      return "+84" + cleaned.substring(1);
    }

    // Nếu số điện thoại không có mã quốc gia, thêm +84
    if (!cleaned.startsWith("84")) {
      return "+84" + cleaned;
    }

    // Nếu số điện thoại đã có mã quốc gia 84, thêm dấu +
    return "+" + cleaned;
  }

  private async generateOTP(phoneNumber: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = this.otpRepository.create({
      phoneNumber,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    return this.otpRepository.save(otp);
  }

  private async sendOTP(phoneNumber: string): Promise<OTP> {
    const otp = await this.generateOTP(phoneNumber);
    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);

    try {
      // Gửi SMS

      return otp;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new Error("Không thể gửi mã OTP. Vui lòng thử lại sau.");
    }
  }

  async requestOTP(phoneNumber: string) {
    // Kiểm tra xem số điện thoại đã được đăng ký chưa
    const existingUser = await this.usersService.findByPhone(phoneNumber);
    console.log(
      "💞💓💗💞💓💗 ~ AuthService ~ requestOTP ~ existingUser:",
      existingUser
    );

    // Gửi OTP
    await this.sendOTP(phoneNumber);

    // Trả về thông tin về trạng thái đăng ký của user
    return {
      isRegistered: !!existingUser,
      message: "Mã OTP đã được gửi",
    };
  }

  async verifyOTP(requestVerifyOTP: RequestVerifyOTP) {
    const { phoneNumber, code } = requestVerifyOTP;

    // Tìm OTP chưa sử dụng và chưa hết hạn
    const otp = await this.otpRepository.findOne({
      where: {
        phoneNumber,
        code,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!otp) {
      throw new UnauthorizedException("Mã OTP không hợp lệ hoặc đã hết hạn");
    }

    // Đánh dấu OTP đã sử dụng
    otp.isUsed = true;
    await this.otpRepository.save(otp);

    // Kiểm tra user đã tồn tại chưa
    const existingUser = await this.usersService.findByPhone(phoneNumber);

    if (existingUser) {
      // Nếu user đã tồn tại -> đăng nhập luôn
      return this.generateToken(existingUser);
    }

    // Nếu user chưa tồn tại -> tạo token tạm thời
    return this.generateTemporaryToken(phoneNumber);
  }

  async register(requestRegisterDto: RequestRegisterDto) {
    const { phoneNumber, name, temporaryToken } = requestRegisterDto;

    // Verify temporary token
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(temporaryToken, {
        secret: this.configService.get("JWT_TEMP_SECRET"),
      });
    } catch (error) {
      throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
    }

    // Kiểm tra số điện thoại trong token có khớp không
    if (decodedToken.phone !== phoneNumber) {
      throw new UnauthorizedException("Số điện thoại không khớp");
    }

    // Kiểm tra user đã tồn tại chưa
    const existingUser = await this.usersService.findByPhone(phoneNumber);
    if (existingUser) {
      throw new UnauthorizedException("Số điện thoại đã được đăng ký");
    }

    // Tạo user mới
    const user = await this.usersService.create({
      phone: phoneNumber,
      fullName: name,
      verifiedPhoneNumber: true,
    });

    // Tạo token chính thức
    return this.generateToken(user);
  }

  private async generateToken(user: any) {
    const payload = { phone: user.phone, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN", "7d"),
    });

    // Lưu token vào database
    const token = this.tokenRepository.create({
      userId: user.id,
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 ngày
    });
    await this.tokenRepository.save(token);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
      },
    };
  }

  private generateTemporaryToken(phoneNumber: string) {
    const payload = { phone: phoneNumber, type: "temporary" };
    return {
      temporary_token: this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_TEMP_SECRET"),
        expiresIn: this.configService.get("JWT_TEMP_EXPIRES_IN", "15m"),
      }),
    };
  }

  async checkToken(userId: number) {
    const token = await this.tokenRepository.findOne({
      where: { userId, isRevoked: false, expiresAt: MoreThan(new Date()) },
    });
    return token;
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Tìm token trong database
      const token = await this.tokenRepository.findOne({
        where: {
          userId: payload.sub,
          refreshToken,
          isRevoked: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (!token) {
        throw new UnauthorizedException("Refresh token không hợp lệ");
      }

      // Tạo access token mới
      const user = await this.usersService.findById(payload.sub);
      const newAccessToken = this.jwtService.sign({
        phone: user.phone,
        sub: user.id,
      });

      // Cập nhật token trong database
      token.accessToken = newAccessToken;
      token.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 ngày
      await this.tokenRepository.save(token);

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException("Refresh token không hợp lệ");
    }
  }

  async logout(userId: number) {
    // Đánh dấu tất cả token của user là đã thu hồi
    await this.tokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
    return { message: "Đăng xuất thành công" };
  }
}
