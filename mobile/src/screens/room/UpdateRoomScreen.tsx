import { getRoom, updateRoom } from "@/api/room/room.api";
import ActionButtonBottom from "@/components/ActionButtonBottom";
import CardContent from "@/components/CardContent";
import { ComboBox } from "@/components/ComboBox";
import InputBase from "@/components/Input";
import Loading from "@/components/Loading";
import Status from "@/components/Status";
import { Switch } from "@/components/Switch";
import { ROOM_STATUS_OPTIONS } from "@/constant/room.constant";
import {
  RoomDetailResponse,
  RoomStatus,
  RoomUpdateRequest,
} from "@/types/room";
import { formatCurrency } from "@/utils/appUtil";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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

  if (isLoading && !defaultValues) {
    return <Loading />;
  }

  return (
    <>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardOpeningTime={0}
        enableAutomaticScroll={true}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CardContent>
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">
                {defaultValues?.name}
              </Text>
              <Text className="text-lg font-bold text-blue-600">
                {defaultValues?.rentAmount?.toLocaleString()}đ
              </Text>
            </View>
            <View className="items-end">
              <Status
                value={defaultValues?.status}
                options={ROOM_STATUS_OPTIONS}
              />
            </View>
          </View>
        </CardContent>

        {/* Compact Form */}
        <CardContent title="Thông tin cơ bản">
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
                  disabled
                  placeholder="Nhập tên gợi nhớ"
                  value={value}
                  showClear={false}
                  onChangeText={onChange}
                  icon="business"
                  label="Toà nhà"
                />
              )}
            />
          </View>

          <View className="mb-3">
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => {
                return (
                  <ComboBox
                    options={
                      value !== RoomStatus.OCCUPIED
                        ? ROOM_STATUS_OPTIONS.filter(
                            (option) => option.value !== RoomStatus.OCCUPIED
                          )
                        : ROOM_STATUS_OPTIONS
                    }
                    valueKey={"value"}
                    value={value}
                    onChange={(value) => {
                      onChange(value.value);
                    }}
                    disabled={value === RoomStatus.OCCUPIED}
                    label="Trạng thái"
                    icon="checkmark-circle"
                    placeholder="Chọn trạng thái"
                    error={erroForms.status?.message}
                    isSearch={false}
                  />
                );
              }}
            />
          </View>

          <View className="mb-3">
            <Controller
              control={control}
              name="floor"
              render={({ field: { onChange, value } }) => (
                <InputBase
                  placeholder="Tầng"
                  type="number"
                  value={value}
                  onChangeText={onChange}
                  icon="layers"
                  label="Tầng"
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
                    placeholder="Số người tối đa"
                    value={value?.toString()}
                    keyboardType="numeric"
                    onChangeText={onChange}
                    icon="people"
                    label="Số người tối đa"
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
                    onChangeText={onChange}
                    icon="resize"
                    label="Diện tích"
                    error={erroForms.area?.message}
                  />
                )}
              />
            </View>
          </View>

          <View className="mb-3">
            <Controller
              control={control}
              name="rentAmount"
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
                  error={erroForms.rentAmount?.message}
                />
              )}
            />
          </View>

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
                  icon="shield-checkmark"
                  label="Tiền cọc"
                  error={erroForms.defaultDepositAmount?.message}
                />
              )}
            />
          </View>

          <View className="mb-3">
            <Controller
              control={control}
              name="isPrepaidRoom"
              render={({ field: { onChange, value } }) => (
                <Switch
                  label="Thanh toán tiền phòng trước"
                  value={value as boolean}
                  onValueChange={onChange}
                />
              )}
            />
          </View>
        </CardContent>

        {/* Mô tả - Compact */}
        <CardContent title="Ghi chú">
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <InputBase
                type="area"
                placeholder="Điều khoản bổ sung"
                value={value ? formatCurrency(value.toString()) : ""}
                onChangeText={onChange}
                label=""
                error={erroForms.description?.message}
              />
            )}
          />
        </CardContent>

        <CardContent
          title="Dịch vụ mặc định"
          description="Bạn có thể thêm hoặc chỉnh sửa dịch vụ khi tạo hợp đồng!"
        >
          <View className="flex-row flex-wrap gap-2">
            {defaultValues?.contractServices?.length === 0 ? (
              <Text className="text-gray-500 text-sm">
                Không có dịch vụ mặc định hãy thêm dịch vụ mặc định trong cập
                nhật tòa nhà
              </Text>
            ) : (
              defaultValues?.contractServices?.map((service, index) => (
                <View
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full"
                >
                  <Text className="text-gray-700 text-sm font-medium">
                    {service?.name}
                  </Text>
                </View>
              ))
            )}
          </View>
        </CardContent>
      </KeyboardAwareScrollView>

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
            variant: "danger",
            isLoading: isLoading,
            icon: "trash-outline",
            hidden: () => defaultValues?.status === RoomStatus.OCCUPIED,
          },
        ]}
      />
    </>
  );
};

export default UpdateRoomScreen;
