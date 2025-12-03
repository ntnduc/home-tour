import { privateApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { ComboOption } from "@/types/comboOption";
import { createSuccessResponse } from "@/utils/apiUtil";

export const getComboProvinces = async (): Promise<
  ApiResponse<ComboOption<string, string>[]>
> => {
  try {
    const response = await privateApi.get<
      ApiResponse<ComboOption<string, string>[]>
    >("/location/provinces");
    if (response.status === 200 && response.data.data) {
      const combo = response.data?.data.map((item) => ({
        key: item.value,
        value: item.value,
        label: item.label,
      }));
      return createSuccessResponse(combo);
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
    >(`/location/districts/${provinceId}`);
    if (response.status === 200 && response.data.data) {
      const combo = response.data?.data.map((item) => ({
        key: item.value,
        value: item.value,
        label: item.label,
      }));
      return createSuccessResponse(combo);
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
    >(`/location/wards/${districtId}`);
    if (response.status === 200 && response.data.data) {
      const combo = response.data?.data.map((item) => ({
        key: item.value,
        value: item.value,
        label: item.label,
      }));
      return createSuccessResponse(combo);
    }
    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    return { success: false, message: "Lỗi khi lấy dữ liệu" };
  }
};
