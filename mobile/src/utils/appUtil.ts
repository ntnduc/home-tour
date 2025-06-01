import { User } from "@/types/user";
import { storage } from "./storage";

export const getStoreUser = async (): Promise<User | undefined> => {
  return await storage.getUser();
};

export const checkLogin = async (): Promise<boolean> => {
  const accessToken = await storage.getAccessToken();
  const user = await storage.getUser();
  return !!(accessToken && user);
};

export const formatCurrency = (value: string) => {
  // Xóa tất cả dấu chấm và dấu phẩy
  const numericValue = value.replace(/[.,]/g, "");
  // Thêm dấu chấm ngăn cách hàng nghìn
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
