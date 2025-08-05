import { getRoom, updateRoom } from "@/api/room/room.api";
import ActionButtonBottom from "@/components/ActionButtonBottom";
import CardContent from "@/components/CardContent";
import InputBase from "@/components/Input";
import { RoomDetailResponse, RoomUpdateRequest } from "@/types/room";
import { formatCurrency } from "@/utils/appUtil";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

type RootStackParamList = {
  UpdateRoom: { roomId: string };
  RoomList: undefined;
};

type UpdateRoomScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: { params: { roomId: any } };
};

const UpdateRoomScreen = ({ navigation, route }: UpdateRoomScreenProps) => {
  const { roomId } = route.params;

  const {
    handleSubmit,
    formState: { isLoading, defaultValues, errors: erroForms },
    control,
  } = useForm<RoomDetailResponse>({
    defaultValues: async () => {
      try {
        const data = await getRoom(roomId);
        if (!data.data) return {} as any;

        return data.data;
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: error.response.data?.message
            ? error.response.data?.message
            : "Không tìm thấy dữ liệu",
        });
        navigation.goBack();
      }
    },
  });

  const statusOptions = [
    {
      value: "Đang thuê",
      label: "Đang thuê",
      color: "#34C759",
      icon: "checkmark-circle",
    },
    {
      value: "Trống",
      label: "Trống",
      color: "#FF9500",
      icon: "ellipse-outline",
    },
    {
      value: "Đang sửa",
      label: "Đang sửa",
      color: "#FF3B30",
      icon: "construct",
    },
  ];

  const handleSave = async (data: RoomUpdateRequest) => {
    try {
      updateRoom(data)
        .then((reponse) => {
          Toast.show({
            type: "success",
            text1: "Thành công",
            text2: "Cập nhật đã thành công",
          });
          navigation.goBack();
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: "Thất bại",
            text2: "Vui lòng thử lại sau!",
          });
        });
    } catch (error) {
      console.error("💞💓💗💞💓💗 ~ handleSave ~ error:", error);
      Toast.show({
        type: "error",
        text1: "Thất bại",
        text2: "Vui lòng thử lại sau!",
      });
    }
  };

  const handleError = () => {
    Toast.show({
      type: "error",
      text1: "Lỗi",
      text2: "Hãy nhập đầy đủ thông tin lại thông tin!",
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa phòng "${null}"?\n\nHành động này không thể hoàn tác.`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              // TODO: Gọi API xóa phòng
              await new Promise((resolve) => setTimeout(resolve, 2000));
              Alert.alert("Thành công", "Đã xóa phòng thành công!", [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("RoomList"),
                },
              ]);
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa phòng");
            } finally {
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Header */}
        <CardContent>
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-1">
                {defaultValues?.name}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">
                {defaultValues?.property?.name}
              </Text>
              <View className="flex-row items-center">
                <View
                  className={`px-3 py-1 rounded-full ${getStatusBgClass(
                    "Đang thuê"
                  )}`}
                >
                  <Text
                    className={`text-xs font-semibold ${getStatusTextClass(
                      "Đang thuê"
                    )}`}
                  >
                    Đang thuê
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-xs text-gray-500 mb-1">Giá hiện tại</Text>
              <Text className="text-lg font-bold text-blue-600">
                {defaultValues?.rentAmount?.toLocaleString()}đ
              </Text>
            </View>
          </View>
        </CardContent>

        {/* Compact Form */}
        <CardContent>
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Thông tin cơ bản
          </Text>

          <View className="mb-3">
            <Controller
              control={control}
              name="name"
              rules={{ required: "Vui lòng nhập tên gợi nhớ" }}
              render={({ field: { onChange, value } }) => (
                <InputBase
                  placeholder="Nhập tên gợi nhớ (không bắt buộc)"
                  value={value}
                  required
                  onChangeText={onChange}
                  icon="home"
                  label="Tên gợi nhớ"
                  error={erroForms.name?.message}
                />
              )}
            />
          </View>

          {/* Tòa nhà */}
          <View className="mb-3">
            <Controller
              control={control}
              name="propertyName"
              render={({ field: { onChange, value } }) => (
                <InputBase
                  readOnly
                  placeholder="Nhập tên gợi nhớ (không bắt buộc)"
                  value={value}
                  showClear={false}
                  onChangeText={onChange}
                  icon="business"
                  label="Toà nhà"
                />
              )}
            />
          </View>

          {/* Giá và Diện tích - 2 cột */}
          <View className="flex-row gap-3">
            <View className="flex-1 mb-3">
              <Controller
                control={control}
                name="maxOccupancy"
                render={({ field: { onChange, value } }) => (
                  <InputBase
                    type="number"
                    placeholder="Số người"
                    value={value?.toString()}
                    keyboardType="numeric"
                    onChangeText={onChange}
                    icon="people"
                    label="Số người"
                    error={erroForms.maxOccupancy?.message}
                  />
                )}
              />
            </View>

            <View className="flex-1 mb-3">
              <Controller
                control={control}
                name="area"
                render={({ field: { onChange, value } }) => (
                  <InputBase
                    type="number"
                    placeholder="Diện tích"
                    value={value?.toString()}
                    keyboardType="numeric"
                    onChangeText={onChange}
                    icon="resize"
                    label="Diện tích"
                    error={erroForms.area?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Số người thuê */}
          <View className="mb-3">
            <Controller
              control={control}
              name="defaultDepositAmount"
              rules={{ required: "VNĐ/tháng" }}
              render={({ field: { onChange, value } }) => (
                <InputBase
                  type="number"
                  placeholder="VNĐ/tháng"
                  value={value ? formatCurrency(value.toString()) : ""}
                  keyboardType="numeric"
                  required
                  onChangeText={onChange}
                  icon="cash"
                  label="Giá thuê mặc định"
                  error={erroForms.defaultDepositAmount?.message}
                />
              )}
            />
          </View>
        </CardContent>

        {/* Trạng thái - Compact */}
        {/* <CardContent>
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Trạng thái phòng
          </Text>
          <View className="gap-2">
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`flex-row items-center p-3 rounded-lg border ${
                  formData.status === option.value
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-200"
                }`}
                onPress={() => updateFormData("status", option.value)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={
                    formData.status === option.value ? "#007AFF" : option.color
                  }
                  className="mr-3"
                />
                <Text
                  className={`text-base font-medium ${
                    formData.status === option.value
                      ? "text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </CardContent> */}

        {/* Mô tả - Compact */}
        <CardContent>
          <Controller
            control={control}
            name="description"
            rules={{ required: "Mô tả" }}
            render={({ field: { onChange, value } }) => (
              <InputBase
                type="area"
                placeholder="Mô tả"
                value={value ? formatCurrency(value.toString()) : ""}
                required
                onChangeText={onChange}
                label="Mô tả"
                error={erroForms.description?.message}
              />
            )}
          />
        </CardContent>
      </ScrollView>

      <ActionButtonBottom
        actions={[
          {
            label: "Lưu thay đổi",
            onPress: handleSubmit(handleSave, handleError),
            variant: "primary",
            isLoading: isLoading,
            icon: "checkmark-circle",
          },
          {
            label: "Xoá phòng",
            onPress: handleSubmit(handleSave, handleError),
            variant: "secondary",
            isLoading: isLoading,
            icon: "trash-outline",
          },
        ]}
      />
    </View>
  );
};

const getStatusBgClass = (status: string) => {
  switch (status) {
    case "Đang thuê":
      return "bg-green-100";
    case "Trống":
      return "bg-orange-100";
    case "Đang sửa":
      return "bg-red-100";
    default:
      return "bg-blue-100";
  }
};

const getStatusTextClass = (status: string) => {
  switch (status) {
    case "Đang thuê":
      return "text-green-700";
    case "Trống":
      return "text-orange-700";
    case "Đang sửa":
      return "text-red-700";
    default:
      return "text-blue-700";
  }
};

export default UpdateRoomScreen;
