import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { LessThan, MoreThan } from "typeorm";
import { AppDataSource } from "../config/database";
import { OTP } from "../entities/OTP";
import { Token } from "../entities/Token";
import { User } from "../entities/User";
import { OTPService } from "../services/OTPService";

export class AuthController {
  private static OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes
  private static RESEND_DELAY = 60 * 1000; // 1 minute
  private static ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
  private static REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds
  private static userRepository = AppDataSource.getRepository(User);
  private static otpRepository = AppDataSource.getRepository(OTP);
  private static tokenRepository = AppDataSource.getRepository(Token);

  static async requestOTP(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
      }

      // Kiểm tra xem có OTP đang chờ không
      const existingOTP = await this.otpRepository.findOne({
        where: {
          phoneNumber,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (existingOTP) {
        const timeSinceLastOTP = Date.now() - existingOTP.createdAt.getTime();
        if (timeSinceLastOTP < this.RESEND_DELAY) {
          const waitTime = Math.ceil(
            (this.RESEND_DELAY - timeSinceLastOTP) / 1000
          );
          return res.status(429).json({
            message: `Vui lòng đợi ${waitTime} giây trước khi yêu cầu mã mới`,
            waitTime,
          });
        }
      }

      // Xóa các OTP cũ của số điện thoại này
      await this.otpRepository.delete({
        phoneNumber,
        isUsed: false,
        expiresAt: LessThan(new Date()),
      });

      const otp = await OTPService.sendOTP(phoneNumber);

      // Lưu OTP mới vào database
      const otpEntity = this.otpRepository.create({
        phoneNumber,
        code: otp,
        expiresAt: new Date(Date.now() + this.OTP_EXPIRY),
      });
      await this.otpRepository.save(otpEntity);

      res.status(200).json({
        message: "Mã OTP đã được gửi",
        expiresIn: this.OTP_EXPIRY / 1000, // Thời gian hết hạn tính bằng giây
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi gửi mã OTP" });
    }
  }

  static async resendOTP(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
      }

      // Kiểm tra xem có OTP đang chờ không
      const existingOTP = await this.otpRepository.findOne({
        where: {
          phoneNumber,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (existingOTP) {
        const timeSinceLastOTP = Date.now() - existingOTP.createdAt.getTime();
        if (timeSinceLastOTP < this.RESEND_DELAY) {
          const waitTime = Math.ceil(
            (this.RESEND_DELAY - timeSinceLastOTP) / 1000
          );
          return res.status(429).json({
            message: `Vui lòng đợi ${waitTime} giây trước khi yêu cầu mã mới`,
            waitTime,
          });
        }
      }

      // Xóa OTP cũ
      await this.otpRepository.delete({
        phoneNumber,
        isUsed: false,
      });

      const otp = await OTPService.sendOTP(phoneNumber);

      // Lưu OTP mới
      const otpEntity = this.otpRepository.create({
        phoneNumber,
        code: otp,
        expiresAt: new Date(Date.now() + this.OTP_EXPIRY),
      });
      await this.otpRepository.save(otpEntity);

      res.status(200).json({
        message: "Mã OTP mới đã được gửi",
        expiresIn: this.OTP_EXPIRY / 1000,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi gửi lại mã OTP" });
    }
  }

  static async verifyOTP(req: Request, res: Response) {
    try {
      const { phoneNumber, otp, name } = req.body;

      if (!phoneNumber || !otp) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      }

      // Tìm OTP hợp lệ
      const otpEntity = await this.otpRepository.findOne({
        where: {
          phoneNumber,
          code: otp,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (!otpEntity) {
        return res
          .status(400)
          .json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
      }

      // Đánh dấu OTP đã sử dụng
      otpEntity.isUsed = true;
      await this.otpRepository.save(otpEntity);

      let user = await this.userRepository.findOne({ where: { phoneNumber } });

      if (!user) {
        if (!name) {
          return res
            .status(400)
            .json({ message: "Vui lòng nhập tên để đăng ký" });
        }
        user = this.userRepository.create({
          name,
          phoneNumber,
        });
        await this.userRepository.save(user);
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "your_jwt_secret_key",
        { expiresIn: "7d" }
      );

      res.status(200).json({
        message: "Xác thực thành công",
        token,
        user: {
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xác thực OTP" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
      }

      // Tìm user theo số điện thoại
      const user = await this.userRepository.findOne({
        where: { phoneNumber },
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Số điện thoại chưa được đăng ký" });
      }

      // Kiểm tra xem có OTP đang chờ không
      const existingOTP = await this.otpRepository.findOne({
        where: {
          phoneNumber,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (existingOTP) {
        const timeSinceLastOTP = Date.now() - existingOTP.createdAt.getTime();
        if (timeSinceLastOTP < this.RESEND_DELAY) {
          const waitTime = Math.ceil(
            (this.RESEND_DELAY - timeSinceLastOTP) / 1000
          );
          return res.status(429).json({
            message: `Vui lòng đợi ${waitTime} giây trước khi yêu cầu mã mới`,
            waitTime,
          });
        }
      }

      // Xóa các OTP cũ
      await this.otpRepository.delete({
        phoneNumber,
        isUsed: false,
      });

      const otp = await OTPService.sendOTP(phoneNumber);

      // Lưu OTP mới
      const otpEntity = this.otpRepository.create({
        phoneNumber,
        code: otp,
        expiresAt: new Date(Date.now() + this.OTP_EXPIRY),
      });
      await this.otpRepository.save(otpEntity);

      res.status(200).json({
        message: "Mã OTP đã được gửi",
        expiresIn: this.OTP_EXPIRY / 1000,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi gửi mã OTP" });
    }
  }

  static async verifyLogin(req: Request, res: Response) {
    try {
      const { phoneNumber, otp } = req.body;

      if (!phoneNumber || !otp) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      }

      // Tìm user
      const user = await this.userRepository.findOne({
        where: { phoneNumber },
      });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Số điện thoại chưa được đăng ký" });
      }

      // Tìm OTP hợp lệ
      const otpEntity = await this.otpRepository.findOne({
        where: {
          phoneNumber,
          code: otp,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (!otpEntity) {
        return res
          .status(400)
          .json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
      }

      // Đánh dấu OTP đã sử dụng
      otpEntity.isUsed = true;
      await this.otpRepository.save(otpEntity);

      // Tạo tokens
      const { accessToken, refreshToken } = await this.generateTokens(user);

      res.status(200).json({
        message: "Đăng nhập thành công",
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xác thực OTP" });
    }
  }
  private static async generateTokens(user: User) {
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret_key",
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );

    // Lưu token vào database
    const token = this.tokenRepository.create({
      userId: user.id,
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY * 1000), // Convert seconds to milliseconds
    });
    await this.tokenRepository.save(token);

    return { accessToken, refreshToken };
  }

  static async checkLogin(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          message: "Không tìm thấy token xác thực",
          isLoggedIn: false,
        });
      }

      // Kiểm tra token trong database
      const tokenEntity = await this.tokenRepository.findOne({
        where: {
          accessToken: token,
          isRevoked: false,
          expiresAt: MoreThan(new Date()),
        },
        relations: ["user"],
      });

      if (!tokenEntity) {
        return res.status(401).json({
          message: "Token không hợp lệ hoặc đã hết hạn",
          isLoggedIn: false,
        });
      }

      res.status(200).json({
        message: "Đã đăng nhập",
        isLoggedIn: true,
        user: {
          id: tokenEntity.user.id,
          name: tokenEntity.user.name,
          phoneNumber: tokenEntity.user.phoneNumber,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi kiểm tra đăng nhập" });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          message: "Vui lòng cung cấp refresh token",
        });
      }

      // Kiểm tra refresh token trong database
      const tokenEntity = await this.tokenRepository.findOne({
        where: {
          refreshToken,
          isRevoked: false,
          expiresAt: MoreThan(new Date()),
        },
        relations: ["user"],
      });

      if (!tokenEntity) {
        return res.status(401).json({
          message: "Refresh token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Tạo tokens mới
      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokens(tokenEntity.user);

      // Đánh dấu token cũ đã hết hạn
      tokenEntity.isRevoked = true;
      await this.tokenRepository.save(tokenEntity);

      res.status(200).json({
        message: "Làm mới token thành công",
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi làm mới token" });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(400).json({
          message: "Vui lòng cung cấp token",
        });
      }

      // Đánh dấu token đã hết hạn
      const tokenEntity = await this.tokenRepository.findOne({
        where: {
          accessToken: token,
          isRevoked: false,
        },
      });

      if (tokenEntity) {
        tokenEntity.isRevoked = true;
        await this.tokenRepository.save(tokenEntity);
      }

      res.status(200).json({
        message: "Đăng xuất thành công",
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi đăng xuất" });
    }
  }
}
