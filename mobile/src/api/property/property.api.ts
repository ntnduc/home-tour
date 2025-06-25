import { privateApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { Property, PropertyCreateRequest } from "@/types/property";

export const createProperty = async (data: PropertyCreateRequest) => {
  const response = await privateApi.post<ApiResponse<Property>>(
    "/property",
    data
  );
  return response;
};
