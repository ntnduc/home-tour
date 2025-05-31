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
