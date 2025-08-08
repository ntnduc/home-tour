import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { RbacService } from '../rbac/rbac.service';
import { User } from '../users/entities/user.entity';
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
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(UsersService)
    private userService: UsersService,
    @Inject(JwtService)
    private jwtService: JwtService,
    @Inject(RbacService)
    private rbacService: RbacService,
  ) {}

  async requestSendOTP(phoneNumber: string): Promise<boolean> {
    const formattedPhoneNumber = AuthService.formatPhoneNumber(phoneNumber);
    const otp = await this.generateOTP(formattedPhoneNumber);
    await this.otpRepository.save(otp);
    return true;
  }

  async verifyOTP(
    phoneNumber: string,
    code: string,
  ): Promise<ReponseOtpVerify> {
    const formattedPhoneNumber = AuthService.formatPhoneNumber(phoneNumber);
    const otp = await this.otpRepository.findOne({
      where: {
        phoneNumber: formattedPhoneNumber,
        code: code,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!otp) {
      throw new BadRequestException('Invalid OTP');
    }
    if (otp.code !== code) {
      throw new BadRequestException('OTP không đúng!');
    }

    otp.isUsed = true;
    await this.otpRepository.update(otp.id, otp);

    const findExitedUser = await this.userRepository.findOne({
      where: {
        phone: formattedPhoneNumber,
        isPhoneVerified: true,
      },
    });

    if (!findExitedUser || !findExitedUser.isPhoneVerified) {
      const tempToken = this.genTemplateToken(formattedPhoneNumber);
      return {
        isRegistered: false,
        tempToken,
      };
    }

    const token = await this.generateToken(
      findExitedUser.id,
      findExitedUser.phone,
    );
    return {
      isRegistered: true,
      refreshToken: token.refreshToken,
      accessToken: token.accessToken,
      user: findExitedUser,
    };
  }

  async register(name: string, phone: string) {
    const userNew = {
      fullName: name,
      phone: phone,
      isPhoneVerified: true,
      isActive: true,
    };
    try {
      const findUser = await this.userRepository.findOneBy({ phone });
      if (findUser) {
        findUser.isPhoneVerified = true;
        const userUpdated = await this.userService.update(
          findUser.id,
          findUser,
        );
        const token = await this.generateToken(
          userUpdated.id,
          userUpdated.phone,
        );
        return {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          user: userUpdated,
        };
      }
    } catch {
      //DO NOTHING
    }
    const user = await this.userRepository.save(userNew);
    const token = await this.generateToken(user.id, user.phone);
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      user: user,
    };
  }

  async refreshToken(refreshToken: string) {
    const token = await this.tokenRepository.findOneBy({
      refreshToken,
      isRevoked: false,
    });

    if (!token) {
      throw new BadRequestException('Invalid refresh token');
    }
    (token.isRevoked = true),
      await this.tokenRepository.update(token.id, token);

    const { sub, phoneNumber } = this.jwtService.decode(token.refreshToken);

    const newToken = await this.generateToken(sub, phoneNumber);

    return {
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken,
    };
  }

  async logout(token: string) {
    const findToken = await this.tokenRepository.findOneBy({
      accessToken: token,
      isRevoked: false,
    });

    if (!findToken) {
      return { isLogout: false };
    }
    findToken.isRevoked = true;
    await this.tokenRepository.update(findToken.id, findToken);
    return { isLogout: true };
  }

  static formatPhoneNumber(phoneNumber: string): string {
    // Bỏ toàn bộ ký tự không phải số
    const digitsOnly = phoneNumber.replace(/\D/g, '');

    if (digitsOnly.startsWith('0')) {
      // Nếu là dạng 09x..., 03x..., 07x... thì chuyển thành +84...
      return '+84' + digitsOnly.slice(1);
    }

    if (digitsOnly.startsWith('84')) {
      // Nếu đã có 84 đầu => thêm dấu +
      return '+' + digitsOnly;
    }

    // Trường hợp không rõ, cứ gắn +84 phía trước
    return '+84' + digitsOnly;
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
    // Get user's roles and properties for JWT payload
    const userProperties =
      await this.rbacService.generateUserProperties(userId);

    const accessTokenPayload = {
      sub: userId, // Standard JWT subject claim
      phoneNumber,
      properties: userProperties, // Array of { propertyId, role, permissions }
      iat: Math.floor(Date.now() / 1000),
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '120m',
    });

    const refreshToken = this.jwtService.sign(
      {
        sub: userId,
        phoneNumber,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '10h',
      },
    );

    const token = await this.tokenRepository.save({
      userId,
      phoneNumber,
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15),
    });

    return token;
  }
}
