import { privateApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { BasePagingRequest } from "@/types/base.request";
import { BasePagingResponse } from "@/types/base.response";
import { ServiceListResponse } from "@/types/service";

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
