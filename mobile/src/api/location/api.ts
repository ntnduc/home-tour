import { privateApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { ComboOption } from "@/types/comboOption";

export const getComboProvinces = async (): Promise<
  ApiResponse<ComboOption<string, string>[]>
> => {
  try {
    const response = await privateApi.get<
      ApiResponse<ComboOption<string, string>[]>
    >("/location/combo-provinces");
    if (response.status === 200) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    return { success: false, message: "Lỗi khi lấy dữ liệu" };
  }
};

export const getComboDistricts = async (
  provinceId: string
): Promise<ApiResponse<ComboOption<string, string>[]>> => {
  try {
    const response = await privateApi.get<
      ApiResponse<ComboOption<string, string>[]>
    >(`/location/combo-districts?provinceCode=${provinceId}`);
    if (response.status === 200) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    return { success: false, message: "Lỗi khi lấy dữ liệu" };
  }
};

export const getComboWards = async (
  districtId: string
): Promise<ApiResponse<ComboOption<string, string>[]>> => {
  try {
    const response = await privateApi.get<
      ApiResponse<ComboOption<string, string>[]>
    >(`/location/combo-wards?districtCode=${districtId}`);
    console.log("💞💓💗💞💓💗 ~ response:", response);
    if (response.status === 200) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    return { success: false, message: "Lỗi khi lấy dữ liệu" };
  }
};
