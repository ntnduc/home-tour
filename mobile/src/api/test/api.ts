import { publicApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { createSuccessResponse, handleApiError } from "@/utils/apiUtil";

export const testApi = async (): Promise<ApiResponse> => {
  try {
    const response = await publicApi.get("/api/test");
    return createSuccessResponse(response.data);
  } catch (error) {
    return handleApiError(error);
  }
};
