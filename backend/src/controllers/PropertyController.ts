import { PropertyService } from "@/services/property/PropertyService";
import { ResponseHandler } from "@/utils/ResponseHandler";
import { Request, Response } from "express";

export class PropertyController {
  static async createProperty(req: Request, res: Response) {
    const property = req.body;

    try {
      const newProperty = await PropertyService.createProperty(property);
      return ResponseHandler.success(res, newProperty);
    } catch (error) {
      console.error("Handle create property error", error);
      return ResponseHandler.error(res, "Server lỗi vui lòng thử lại!");
    }
  }
}
