import { privateApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { BasePagingRequest } from "@/types/base.request";
import { BasePagingResponse } from "@/types/base.response";
import { RoomListResponse } from "@/types/room";

export const getListRoom = async (
  queryKey: BasePagingRequest
): Promise<ApiResponse<BasePagingResponse<RoomListResponse>>> => {
  const { limit, offset, filters, sortBy, sortOrder, globalKey } = queryKey;

  const response = await privateApi.get<
    ApiResponse<BasePagingResponse<RoomListResponse>>
  >("/rooms", {
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
