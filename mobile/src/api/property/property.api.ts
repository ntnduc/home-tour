import { privateApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { BasePagingRequest } from "@/types/base.request";
import { BasePagingResponse } from "@/types/base.response";
import {
  Property,
  PropertyCreateRequest,
  PropertyDetail,
  PropertyListResponse,
  PropertyUpdateRequest,
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
  const { limit, offset, filters, sortBy, sortOrder, globalKey } = queryKey;

  const response = await privateApi.get<
    ApiResponse<BasePagingResponse<PropertyListResponse>>
  >("/property", {
    params: {
      limit,
      offset,
      filters,
      globalKey,
      sortBy,
      sortOrder,
    },
  });

  return response.data;
};

export const getProperty = async (
  id: string
): Promise<ApiResponse<PropertyDetail>> => {
  const response = await privateApi.get<ApiResponse<PropertyDetail>>(
    `/property/${id}`
  );

  return response.data;
};

export const updateProperty = async (
  id: string,
  data: PropertyUpdateRequest
): Promise<ApiResponse<PropertyDetail>> => {
  const response = await privateApi.put<ApiResponse<PropertyDetail>>(
    "/property",
    data
  );

  return response.data;
};
