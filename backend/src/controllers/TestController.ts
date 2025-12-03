import { Request, Response } from "express";
import { ResponseHandler } from "../utils/ResponseHandler";

export class TestController {
  static async test(req: Request, res: Response) {
    return ResponseHandler.success(res, { message: "Hello World" });
  }
}
