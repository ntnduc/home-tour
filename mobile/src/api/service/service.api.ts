import { privateApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { BasePagingRequest } from "@/types/base.request";
import { BasePagingResponse } from "@/types/base.response";
import { ServiceDefaultResponse, ServiceListResponse } from "@/types/service";

export const getListService = async (
  queryKey: BasePagingRequest
): Promise<ApiResponse<BasePagingResponse<ServiceListResponse[]>>> => {
  const response = await privateApi.get<
    ApiResponse<BasePagingResponse<ServiceListResponse[]>>
  >("/services", {
    params: {
      ...queryKey,
    },
  });
  return response.data;
};

export const getServiceDefault = async (): Promise<
  ApiResponse<ServiceDefaultResponse[]>
> => {
  const response = await privateApi.get<ApiResponse<ServiceDefaultResponse[]>>(
    "/services/default-selected"
  );
  return response.data;
};
