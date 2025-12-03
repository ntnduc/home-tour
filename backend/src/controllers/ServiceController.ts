import { Request, Response } from "express";
import { ServicePropertyService } from "../services/property/ServicePropertyService";
import { ResponseHandler } from "../utils/ResponseHandler";

export const ServiceController = {
  async getComboServiceExisted(req: Request, res: Response) {
    try {
      const comboServices = await ServicePropertyService.getComboServices();
      return ResponseHandler.success(res, comboServices);
    } catch (error) {
      return ResponseHandler.error(res, "Lỗi lấy danh sách dịch vụ.");
    }
  },
};
