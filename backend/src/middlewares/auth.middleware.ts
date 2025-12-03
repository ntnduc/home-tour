import { NextFunction, Request, Response } from "express";
import passport from "passport";

// Danh sách các route public không cần xác thực
const publicRoutes = [
  "/api/auth/request-otp",
  "/api/auth/verify-otp",
  "/api/auth/login",
  "/api/auth/verify-login",
  "/api/auth/refresh-token",
];

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Kiểm tra nếu route là public
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          message: "Token không hợp lệ hoặc đã hết hạn",
          isLoggedIn: false,
        });
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};
