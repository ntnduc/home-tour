import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { AdministrativeRegions } from "../entities/AdministrativeRegions";
import { AdministrativeUnit } from "../entities/AdministrativeUnit";
import { Districts } from "../entities/Districts";
import { OTP } from "../entities/OTP";
import { Properties } from "../entities/Properties";
import { PropertyService } from "../entities/PropertyService";
import { Provinces } from "../entities/Provinces";
import { Service } from "../entities/Service";
import { Token } from "../entities/Token";
import { User } from "../entities/User";
import { UserProperties } from "../entities/UserProperties";
import { Wards } from "../entities/Wards";

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
  entities: [
    User,
    OTP,
    Token,
    Properties,
    UserProperties,
    Provinces,
    AdministrativeRegions,
    AdministrativeUnit,
    Districts,
    Wards,
    Service,
    PropertyService,
  ],
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
  migrationsRun: true,
});
