import { ApiResponse } from "@/types/api";
import { BasePagingResponse } from "@/types/base.response";

// Placeholder tenant type - should be defined in types
export interface TenantListResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomId?: string;
  roomName?: string;
  propertyName?: string;
  contractStatus: "active" | "expired" | "pending";
  rentAmount: number;
  depositAmount: number;
  startDate: string;
  endDate?: string;
}

export interface GetListTenantParams {
  limit: number;
  offset: number;
  globalKey?: string;
  propertyId?: string;
  roomId?: string;
}

// Placeholder API function - should be implemented with actual API calls
export const getListTenant = async (
  params: GetListTenantParams
): Promise<ApiResponse<BasePagingResponse<TenantListResponse>>> => {
  // TODO: Implement actual API call
  // This is a placeholder that returns mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          items: [],
          total: 0,
          limit: params.limit,
          offset: params.offset,
        },
        message: "Success",
        success: true,
      });
    }, 1000);
  });
};
