import { privateApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { Property, PropertyCreateRequest } from "@/types/property";

export const createProperty = async (data: PropertyCreateRequest) => {
  try {
    const response = await privateApi.post<ApiResponse<Property>>(
      "/property",
      data
    );
    console.log("💞💓💗💞💓💗 ~ createProperty ~ response:", response);
    if (response.status === 200) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi tạo bất động sản",
      data: null,
    };
  }
};
