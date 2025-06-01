import { Request, Response } from "express";

export class TenantController {
  static async createTenant(req: Request, res: Response) {
    const { name, description } = req.body;
  }
}
