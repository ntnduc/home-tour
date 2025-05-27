import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
