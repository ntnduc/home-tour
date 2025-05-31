import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { LessThan, MoreThan } from "typeorm";
import { AppDataSource } from "../config/database";
import { OTP } from "../entities/OTP";
import { Token } from "../entities/Token";
import { User } from "../entities/User";
import { OTPService } from "../services/OTPService";
import { ResponseHandler } from "../utils/ResponseHandler";

export class AuthController {
  private static OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes
  private static RESEND_DELAY = 60 * 1000; // 1 minute
  private static ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
  private static REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

  // Khởi tạo repositories
  private static userRepository = AppDataSource.getRepository(User);
  private static otpRepository = AppDataSource.getRepository(OTP);
  private static tokenRepository = AppDataSource.getRepository(Token);

  static async requestOTP(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return ResponseHandler.validationError(
          res,
          "Vui lòng nhập số điện thoại"
        );
      }

      // Kiểm tra xem có OTP đang chờ không
      const existingOTP = await AuthController.otpRepository.findOne({
        where: {
          phoneNumber,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (existingOTP) {
        const timeSinceLastOTP = Date.now() - existingOTP.createdAt.getTime();
        if (timeSinceLastOTP < AuthController.RESEND_DELAY) {
          const waitTime = Math.ceil(
            (AuthController.RESEND_DELAY - timeSinceLastOTP) / 1000
          );
          return ResponseHandler.tooManyRequests(
            res,
            `Vui lòng đợi ${waitTime} giây trước khi yêu cầu mã mới`,
            waitTime
          );
        }
      }

      // Xóa các OTP cũ của số điện thoại này
      await AuthController.otpRepository.delete({
        phoneNumber,
        isUsed: false,
        expiresAt: LessThan(new Date()),
      });

      const otp = await OTPService.sendOTP(phoneNumber);

      // Lưu OTP mới vào database
      const otpEntity = AuthController.otpRepository.create({
        phoneNumber,
        code: otp,
        expiresAt: new Date(Date.now() + AuthController.OTP_EXPIRY),
      });
      await AuthController.otpRepository.save(otpEntity);

      return ResponseHandler.success(
        res,
        { expiresIn: AuthController.OTP_EXPIRY / 1000 },
        "Mã OTP đã được gửi"
      );
    } catch (error) {
      console.error("Error sending OTP:", error);
      return ResponseHandler.serverError(res, "Lỗi khi gửi mã OTP");
    }
  }

  static async resendOTP(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
      }

      // Kiểm tra xem có OTP đang chờ không
      const existingOTP = await AuthController.otpRepository.findOne({
        where: {
          phoneNumber,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (existingOTP) {
        const timeSinceLastOTP = Date.now() - existingOTP.createdAt.getTime();
        if (timeSinceLastOTP < AuthController.RESEND_DELAY) {
          const waitTime = Math.ceil(
            (AuthController.RESEND_DELAY - timeSinceLastOTP) / 1000
          );
          return res.status(429).json({
            message: `Vui lòng đợi ${waitTime} giây trước khi yêu cầu mã mới`,
            waitTime,
          });
        }
      }

      // Xóa OTP cũ
      await AuthController.otpRepository.delete({
        phoneNumber,
        isUsed: false,
      });

      const otp = await OTPService.sendOTP(phoneNumber);

      // Lưu OTP mới
      const otpEntity = AuthController.otpRepository.create({
        phoneNumber,
        code: otp,
        expiresAt: new Date(Date.now() + AuthController.OTP_EXPIRY),
      });
      await AuthController.otpRepository.save(otpEntity);

      res.status(200).json({
        message: "Mã OTP mới đã được gửi",
        expiresIn: AuthController.OTP_EXPIRY / 1000,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi gửi lại mã OTP" });
    }
  }

  static async verifyOTP(req: Request, res: Response) {
    try {
      const { phoneNumber, otp } = req.body;

      if (!phoneNumber || !otp) {
        return ResponseHandler.validationError(
          res,
          "Vui lòng nhập đầy đủ thông tin"
        );
      }

      // Tìm OTP hợp lệ
      const otpEntity = await AuthController.otpRepository.findOne({
        where: {
          phoneNumber,
          code: otp,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (!otpEntity) {
        return ResponseHandler.error(
          res,
          "Mã OTP không hợp lệ hoặc đã hết hạn"
        );
      }

      // Đánh dấu OTP đã sử dụng
      otpEntity.isUsed = true;
      await AuthController.otpRepository.save(otpEntity);

      // Tìm user theo số điện thoại
      const user = await AuthController.userRepository.findOne({
        where: { phoneNumber },
      });

      // Nếu chưa có user, tạo một token tạm thời để đăng ký
      if (!user) {
        const registrationToken = jwt.sign(
          { phoneNumber, otpId: otpEntity.id },
          process.env.JWT_SECRET || "your_jwt_secret_key",
          { expiresIn: "15m" }
        );

        return ResponseHandler.success(
          res,
          { registrationToken, isRegistered: false },
          "Xác thực OTP thành công. Vui lòng đăng ký tài khoản."
        );
      }

      // Nếu đã có user, tạo token đăng nhập
      const { accessToken, refreshToken } = await AuthController.generateTokens(
        user
      );

      return ResponseHandler.success(
        res,
        {
          accessToken,
          refreshToken,
          isRegistered: true,
          user: {
            id: user.id,
            name: user.name,
            phoneNumber: user.phoneNumber,
          },
        },
        "Đăng nhập thành công"
      );
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return ResponseHandler.serverError(res, "Lỗi khi xác thực OTP");
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { fullname, registrationToken } = req.body;

      if (!fullname || !registrationToken) {
        return ResponseHandler.validationError(
          res,
          "Vui lòng nhập đầy đủ thông tin"
        );
      }

      // Xác thực registration token
      const decoded = jwt.verify(
        registrationToken,
        process.env.JWT_SECRET || "your_jwt_secret_key"
      ) as { phoneNumber: string; otpId: number };

      // Kiểm tra OTP đã được sử dụng chưa
      const otpEntity = await AuthController.otpRepository.findOne({
        where: {
          id: decoded.otpId,
          isUsed: true,
        },
      });

      if (!otpEntity) {
        return ResponseHandler.error(
          res,
          "Phiên đăng ký không hợp lệ hoặc đã hết hạn"
        );
      }

      // Kiểm tra xem số điện thoại đã được đăng ký chưa
      const existingUser = await AuthController.userRepository.findOne({
        where: { phoneNumber: decoded.phoneNumber },
      });

      if (existingUser) {
        return ResponseHandler.success(
          res,
          { isRegistered: true },
          "Số điện thoại này đã được đăng ký"
        );
      }

      // Tạo user mới
      const user = AuthController.userRepository.create({
        name: fullname,
        phoneNumber: decoded.phoneNumber,
      });
      await AuthController.userRepository.save(user);

      // Tạo và lưu tokens
      const { accessToken, refreshToken } = await AuthController.generateTokens(
        user
      );

      // Lưu token vào database
      const token = AuthController.tokenRepository.create({
        userId: user.id,
        accessToken,
        refreshToken,
        expiresAt: new Date(
          Date.now() + AuthController.REFRESH_TOKEN_EXPIRY * 1000
        ),
        isRevoked: false,
      });
      await AuthController.tokenRepository.save(token);

      return ResponseHandler.success(
        res,
        {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            name: user.name,
            phoneNumber: user.phoneNumber,
          },
        },
        "Đăng ký thành công"
      );
    } catch (error) {
      console.error("Error registering:", error);
      if (error instanceof jwt.JsonWebTokenError) {
        return ResponseHandler.error(
          res,
          "Phiên đăng ký không hợp lệ hoặc đã hết hạn"
        );
      }
      return ResponseHandler.serverError(res, "Lỗi khi đăng ký");
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
      }

      // Tìm user theo số điện thoại
      const user = await AuthController.userRepository.findOne({
        where: { phoneNumber },
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Số điện thoại chưa được đăng ký" });
      }

      // Kiểm tra xem có OTP đang chờ không
      const existingOTP = await AuthController.otpRepository.findOne({
        where: {
          phoneNumber,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (existingOTP) {
        const timeSinceLastOTP = Date.now() - existingOTP.createdAt.getTime();
        if (timeSinceLastOTP < AuthController.RESEND_DELAY) {
          const waitTime = Math.ceil(
            (AuthController.RESEND_DELAY - timeSinceLastOTP) / 1000
          );
          return res.status(429).json({
            message: `Vui lòng đợi ${waitTime} giây trước khi yêu cầu mã mới`,
            waitTime,
          });
        }
      }

      // Xóa các OTP cũ
      await AuthController.otpRepository.delete({
        phoneNumber,
        isUsed: false,
      });

      const otp = await OTPService.sendOTP(phoneNumber);

      // Lưu OTP mới
      const otpEntity = AuthController.otpRepository.create({
        phoneNumber,
        code: otp,
        expiresAt: new Date(Date.now() + AuthController.OTP_EXPIRY),
      });
      await AuthController.otpRepository.save(otpEntity);

      res.status(200).json({
        message: "Mã OTP đã được gửi",
        expiresIn: AuthController.OTP_EXPIRY / 1000,
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
      const user = await AuthController.userRepository.findOne({
        where: { phoneNumber },
      });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Số điện thoại chưa được đăng ký" });
      }

      // Tìm OTP hợp lệ
      const otpEntity = await AuthController.otpRepository.findOne({
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
      await AuthController.otpRepository.save(otpEntity);

      // Tạo tokens
      const { accessToken, refreshToken } = await AuthController.generateTokens(
        user
      );

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
      { expiresIn: AuthController.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret_key",
      { expiresIn: AuthController.REFRESH_TOKEN_EXPIRY }
    );

    // Lưu token vào database
    const token = AuthController.tokenRepository.create({
      userId: user.id,
      accessToken,
      refreshToken,
      expiresAt: new Date(
        Date.now() + AuthController.REFRESH_TOKEN_EXPIRY * 1000
      ), // Convert seconds to milliseconds
    });
    await AuthController.tokenRepository.save(token);

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
      const tokenEntity = await AuthController.tokenRepository.findOne({
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
      const tokenEntity = await AuthController.tokenRepository.findOne({
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
        await AuthController.generateTokens(tokenEntity.user);

      // Đánh dấu token cũ đã hết hạn
      tokenEntity.isRevoked = true;
      await AuthController.tokenRepository.save(tokenEntity);

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
      const tokenEntity = await AuthController.tokenRepository.findOne({
        where: {
          accessToken: token,
          isRevoked: false,
        },
      });

      if (tokenEntity) {
        tokenEntity.isRevoked = true;
        await AuthController.tokenRepository.save(tokenEntity);
      }

      res.status(200).json({
        message: "Đăng xuất thành công",
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi đăng xuất" });
    }
  }
}
