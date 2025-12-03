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
        key: province.code,
        value: province.code,
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
      const districts = await LocationController.districtRepository.find({
        where: { provinceCode: provinceCode?.toString() },
        order: {
          name: "ASC",
        },
      });
      if (!districts) {
        return ResponseHandler.error(res, "Không tìm thấy ví trí.");
      }
      const result = districts.map((district) => ({
        key: district.code,
        value: district.code,
        label: district.fullName,
      }));

      return ResponseHandler.success(res, result);
    } catch (error) {
      return ResponseHandler.error(res, " Lỗi lấy danh sách ví trí.");
    }
  }

  static async getComboWards(req: Request, res: Response) {
    try {
      const { districtCode } = req.query;

      const wards = await LocationController.wardRepository.find({
        where: { districtCode: districtCode?.toString() },
        order: {
          name: "ASC",
        },
      });
      if (!wards) {
        return ResponseHandler.error(res, "Không tìm thấy ví trí.");
      }
      const result = wards.map((ward) => ({
        key: ward.code,
        value: ward.code,
        label: ward.fullName,
      }));

      return ResponseHandler.success(res, result);
    } catch (error) {
      return ResponseHandler.error(res, " Lỗi lấy danh sách ví trí.");
    }
  }
}
