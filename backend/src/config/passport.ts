import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { MoreThan } from "typeorm";
import { Token } from "../entities/Token";
import { User } from "../entities/User";
import { AppDataSource } from "./database";

const userRepository = AppDataSource.getRepository(User);
const tokenRepository = AppDataSource.getRepository(Token);

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "your_jwt_secret_key",
    },
    async (payload, done) => {
      try {
        // Kiểm tra token trong database
        const token = await tokenRepository.findOne({
          where: {
            userId: payload.userId,
            isRevoked: false,
            expiresAt: MoreThan(new Date()),
          },
        });

        if (!token) {
          return done(null, false);
        }

        const user = await userRepository.findOne({
          where: { id: payload.userId },
        });

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Local Strategy cho OTP
passport.use(
  new LocalStrategy(
    {
      usernameField: "phoneNumber",
      passwordField: "otp",
    },
    async (phoneNumber, otp, done) => {
      try {
        const user = await userRepository.findOne({
          where: { phoneNumber },
        });

        if (!user) {
          return done(null, false, {
            message: "Số điện thoại chưa được đăng ký",
          });
        }

        // Kiểm tra OTP ở đây
        // ...

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
