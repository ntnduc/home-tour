import { privateApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { BasePagingRequest } from "@/types/base.request";
import { BasePagingResponse } from "@/types/base.response";
import {
  Property,
  PropertyCreateRequest,
  PropertyListResponse,
} from "@/types/property";

export const createProperty = async (data: PropertyCreateRequest) => {
  const response = await privateApi.post<ApiResponse<Property>>(
    "/property",
    data
  );
  return response;
};

export const getListProperty = async (
  queryKey: BasePagingRequest
): Promise<ApiResponse<BasePagingResponse<PropertyListResponse>>> => {
  const { limit, offset, filters, sortBy, sortOrder } = queryKey;

  const response = await privateApi.get<
    ApiResponse<BasePagingResponse<PropertyListResponse>>
  >("/property", {
    params: {
      limit,
      offset,
      filters,
      sortBy,
      sortOrder,
    },
  });

  console.log("💞💓💗💞💓💗 ~ response:", response);

  return response.data;
};
