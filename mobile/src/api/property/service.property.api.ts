import { privateApi } from "@/services/api";
import { ApiResponse } from "@/types/api";
import { ComboOption } from "@/types/comboOption";

export const getComboService = async (): Promise<
  ApiResponse<ComboOption<number, string>[]>
> => {
  try {
    const response = await privateApi.get<
      ApiResponse<ComboOption<number, string>[]>
    >("/property/combo-service");
    if (response.status === 200) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi lấy dữ liệu",
    };
  }
};
