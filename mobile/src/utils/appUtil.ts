import { checkLogin as checkLoginApi } from "@/api/auth/api";
import { User } from "@/types/user";
import uuid from "react-native-uuid";
import { storage } from "./storage";

export const getStoreUser = async (): Promise<User | undefined> => {
  return await storage.getUser();
};

export const checkLogin = async (): Promise<boolean> => {
  const accessToken = await storage.getAccessToken();
  const user = await storage.getUser();
  if (!accessToken || !user) {
    return false;
  }
  const reponse = await checkLoginApi();
  if (reponse.data?.isLoggedIn) {
    return true;
  }
  return false;
};

export const formatCurrency = (value: string) => {
  const numericValue = value.replace(/[.,]/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const generateId = () => {
  return uuid.v4();
};
