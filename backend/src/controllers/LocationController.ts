import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Districts } from "../entities/Districts";
import { Provinces } from "../entities/Provinces";
import { Wards } from "../entities/Wards";
import { ResponseHandler } from "../utils/ResponseHandler";

export class LocationController {
  private static provinceRepository = AppDataSource.getRepository(Provinces);
  private static districtRepository = AppDataSource.getRepository(Districts);
  private static wardRepository = AppDataSource.getRepository(Wards);

  static async getComboProvinces(req: Request, res: Response) {
    try {
      const provinces = await LocationController.provinceRepository.find();
      if (!provinces) {
        return ResponseHandler.error(res, "Không tìm thấy ví trí.");
      }
      const result = provinces.map((province) => ({
        key: Number(province.code),
        value: Number(province.code),
        label: province.name,
      }));

      return ResponseHandler.success(res, result);
    } catch (error) {
      return ResponseHandler.error(res, " Lỗi lấy danh sách ví trí.");
    }
  }

  static async getComboDistricts(req: Request, res: Response) {
    try {
      const { provinceCode } = req.query;
      const code =
        Number(provinceCode) < 10
          ? "0" + provinceCode
          : provinceCode?.toString();
      const districts = await LocationController.districtRepository.find({
        where: { provinceCode: code },
        order: {
          name: "ASC",
        },
      });
      if (!districts) {
        return ResponseHandler.error(res, "Không tìm thấy ví trí.");
      }
      const result = districts.map((district) => ({
        key: Number(district.code),
        value: Number(district.code),
        label: district.fullName,
      }));

      return ResponseHandler.success(res, result);
    } catch (error) {
      return ResponseHandler.error(res, " Lỗi lấy danh sách ví trí.");
    }
  }
}
