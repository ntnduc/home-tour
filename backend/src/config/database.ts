import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { OTP } from "../entities/OTP";
import { Token } from "../entities/Token";
import { User } from "../entities/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.DB_LOGGING === "true",
  entities: [User, OTP, Token],
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
  migrationsRun: true,
});
