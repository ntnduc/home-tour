import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import "reflect-metadata";
import { AppDataSource } from "./config/database";
import "./config/passport";
import { AuthController } from "./controllers/AuthController";
import { LocationController } from "./controllers/LocationController";
import { TestController } from "./controllers/TestController";
import { authMiddleware } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

//#region Public API
// Authen api
app.post("/api/auth/request-otp", AuthController.requestOTP);
app.post("/api/auth/resend-otp", AuthController.resendOTP);
app.post("/api/auth/verify-otp", AuthController.verifyOTP);
app.post("/api/auth/register", AuthController.register);
app.post("/api/auth/login", AuthController.login);
app.post("/api/auth/verify-login", AuthController.verifyLogin);
app.post("/api/auth/refresh-token", AuthController.refreshToken);

// Test api
app.get("/api/test", TestController.test);
//#endregion

//#region Protected routes
// Location api
app.get(
  "/api/location/combo-provinces",
  authMiddleware,
  LocationController.getComboProvinces
);
app.get(
  "/api/location/combo-districts",
  authMiddleware,
  LocationController.getComboDistricts
);
app.get(
  "/api/location/combo-wards",
  authMiddleware,
  LocationController.getComboWards
);

// Property api
// app.post("/api/property", authMiddleware, PropertyController.createProperty);

// Auth api
app.post("/api/auth/logout", authMiddleware, AuthController.logout);
app.get("/api/auth/check-login", authMiddleware, AuthController.checkLogin);

// User api
app.get("/api/user/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Thông tin người dùng",
    user: req.user,
  });
});

//#endregion

// Initialize TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log("Đã kết nối với PostgreSQL");
  })
  .catch((error) => {
    console.error("Lỗi kết nối PostgreSQL:", error);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
