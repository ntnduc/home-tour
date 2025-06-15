import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ReponseOtpVerify } from './dto/auth.dto';
import { OTP } from './entities/OTP.entity';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,

    @Inject(UsersService)
    private userService: UsersService,
    @Inject(JwtService)
    private jwtService: JwtService,
  ) {}

  async requestSendOTP(phoneNumber: string): Promise<void> {
    const formattedPhoneNumber = AuthService.formatPhoneNumber(phoneNumber);
    const otp = await this.generateOTP(formattedPhoneNumber);
    await this.otpRepository.save(otp);
  }

  async verifyOTP(
    phoneNumber: string,
    code: string,
  ): Promise<ReponseOtpVerify> {
    const formattedPhoneNumber = AuthService.formatPhoneNumber(phoneNumber);
    const otp = await this.otpRepository.findOne({
      where: {
        phoneNumber: formattedPhoneNumber,
        code,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const findExitedUser =
      await this.userService.findUserByPhone(formattedPhoneNumber);

    if (!findExitedUser) {
      const tempToken = this.genTemplateToken(formattedPhoneNumber);
      return {
        isRegistered: false,
        tempToken,
      };
    }

    if (findExitedUser.isPhoneVerified) {
      throw new BadRequestException('User already verified');
    }

    const token = await this.generateToken(
      findExitedUser.id,
      findExitedUser.phone,
    );
    return {
      isRegistered: true,
      refreshToken: token.refreshToken,
      accessToken: token.accessToken,
      user: token.user,
    };
  }

  async register(name: string, phone: string) {
    const user = await this.userService.findUserUnVerify(phone);
    if (!user) throw new BadRequestException('Không tìm thấy user');
    user.isPhoneVerified = true;
    const userUpdateDto = { isPhoneVerified: true, fullName: name };
    await this.userService.update(user.id, userUpdateDto);
    const token = await this.generateToken(user.id, user.phone);
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      user: token.user,
    };
  }

  static formatPhoneNumber(phoneNumber: string): string {
    // Loại bỏ tất cả ký tự không phải số
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Nếu số điện thoại bắt đầu bằng 0, thay thế bằng +84
    if (cleaned.startsWith('0')) {
      return '+84' + cleaned.substring(1);
    }

    // Nếu số điện thoại không có mã quốc gia, thêm +84
    if (!cleaned.startsWith('84')) {
      return '+84' + cleaned;
    }

    // Nếu số điện thoại đã có mã quốc gia 84, thêm dấu +
    return '+' + cleaned;
  }

  private async generateOTP(phoneNumber: string): Promise<OTP> {
    const otpGen = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = this.otpRepository.create({
      phoneNumber,
      code: otpGen,
      expiresAt: new Date(Date.now() + 1000 * 60),
    });
    return this.otpRepository.save(otp);
  }

  private genTemplateToken(phoneNumber: string) {
    const token = this.jwtService.sign(
      {
        phoneNumber,
      },
      {
        secret: process.env.JWT_TEMP_SECRET,
        expiresIn: '5m',
      },
    );

    return token;
  }

  private async generateToken(
    userId: string,
    phoneNumber: string,
  ): Promise<Token> {
    const accessToken = this.jwtService.sign(
      {
        userId,
        phoneNumber,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '10m',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId,
        phoneNumber,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '1h',
      },
    );

    const token = await this.tokenRepository.save({
      userId,
      phoneNumber,
      accessToken,
      refreshToken,
    });

    return token;
  }
}
