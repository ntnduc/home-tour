import ActionButtonBottom from "@/components/ActionButtonBottom";
import CardContent from "@/components/CardContent";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { ServiceCalculateMethod } from "@/constant/service.constant";
import { ContractService } from "@/types/contract-service";
import { formatCurrency } from "@/utils/appUtil";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import { getRoomService } from "../../api/room/room.api";
import { ContractCreateRequest } from "../../types/contract";
import { RoomServiceDetailResponse, RoomStatus } from "../../types/room";

type RootStackParamList = {
  CreateContract: { roomId: string };
  RoomList: undefined;
};

type CreateContractScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: { params: { roomId: string } };
};

const CreateContractScreen = ({
  navigation,
  route,
}: CreateContractScreenProps) => {
  const { roomId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRoomData, setIsLoadingRoomData] = useState(true);
  const [roomData, setRoomData] = useState<RoomServiceDetailResponse | null>(
    null
  );

  const {
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ContractCreateRequest>({
    defaultValues: {
      roomId: roomId,
      contractServices: roomData?.services.map((service) => ({
        isEnabled: true,
        isNew: false,
        isSelectedFromService: false,
        price: service.price,
        propertyServiceId: service.propertyServiceId,
        calculationMethod: service.calculationMethod,
        notes: "",
      })),
    },
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setIsLoadingRoomData(true);

        const roomServiceResponse = await getRoomService(roomId);

        if (roomServiceResponse.success && roomServiceResponse.data) {
          setRoomData(roomServiceResponse.data);
          if (
            roomServiceResponse.data?.services &&
            roomServiceResponse.data?.services.length > 0
          ) {
            const contractServices = roomServiceResponse.data?.services.map(
              (service) => ({
                isEnabled: true,
                isNew: false,
                isSelectedFromService: false,
                price: service.price,
                propertyServiceId: service.propertyServiceId,
                calculationMethod: service.calculationMethod,
                notes: "",
              })
            ) as ContractService[];
            setValue("contractServices", contractServices);
          }
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin phòng và dịch vụ");
      } finally {
        setIsLoadingRoomData(false);
      }
    };

    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // TODO: Gọi API tạo hợp đồng
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      Alert.alert("Thành công", "Đã tạo hợp đồng thành công!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("RoomList"),
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo hợp đồng");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || isLoadingRoomData) {
    return <Loading />;
  }

  if (!isLoadingRoomData && roomData?.status !== RoomStatus.AVAILABLE) {
    Toast.show({
      type: "error",
      text1: "Lỗi",
      text2: "Phòng đã được cho thuê!",
    });
    navigation.goBack();
  }

  const contractServices = getValues("contractServices");
  const watchContractServices = watch("contractServices");
  console.log(
    "💞💓💗💞💓💗 ~ CreateContractScreen ~ watchContractServices:",
    watchContractServices
  );
  console.log(
    "💞💓💗💞💓💗 ~ CreateContractScreen ~ contractServices:",
    contractServices
  );

  return (
    <View className="flex-1 bg-gray-50">
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableAutomaticScroll={true}
      >
        <ScrollView
          className="flex-1 px-4 py-3"
          showsVerticalScrollIndicator={false}
        >
          <CardContent>
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 mb-1">
                  {roomData?.name || "Tên phòng"}
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  {roomData?.property?.name || "Tên tòa nhà"}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-gray-500 mb-1">Giá thuê</Text>
                <Text className="text-lg font-bold text-blue-600">
                  {formatCurrency(roomData?.rentAmount?.toString() || "0")}
                  đ/tháng
                </Text>
              </View>
            </View>
          </CardContent>

          {/* Thông tin người thuê */}
          {/* <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Thông tin người thuê
          </Text>

          <View className="mb-3">
            <Controller
              control={control}
              name="user"
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
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Họ và tên *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${
                errors.tenantName
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <Ionicons
                name="person"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.tenantName}
                onChangeText={(value) => updateFormData("tenantName", value)}
                placeholder="Nhập họ và tên"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.tenantName && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.tenantName}
              </Text>
            )}
          </View>

          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Số điện thoại *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${
                errors.tenantPhone
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <Ionicons
                name="call"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.tenantPhone}
                onChangeText={(value) => updateFormData("tenantPhone", value)}
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
            {errors.tenantPhone && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.tenantPhone}
              </Text>
            )}
          </View>

          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Email
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${
                errors.tenantEmail
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <Ionicons
                name="mail"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.tenantEmail}
                onChangeText={(value) => updateFormData("tenantEmail", value)}
                placeholder="Nhập email (tùy chọn)"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.tenantEmail && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.tenantEmail}
              </Text>
            )}
          </View>

          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              CMND/CCCD *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${
                errors.tenantIdCard
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <Ionicons
                name="card"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.tenantIdCard}
                onChangeText={(value) => updateFormData("tenantIdCard", value)}
                placeholder="Nhập số CMND/CCCD"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
            {errors.tenantIdCard && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.tenantIdCard}
              </Text>
            )}
          </View>

          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Địa chỉ *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${
                errors.tenantAddress
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <Ionicons
                name="location"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.tenantAddress}
                onChangeText={(value) => updateFormData("tenantAddress", value)}
                placeholder="Nhập địa chỉ"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.tenantAddress && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.tenantAddress}
              </Text>
            )}
          </View>
        </View> */}

          <CardContent title="Thời hạn thuê">
            <View className="mb-3">
              <Controller
                control={control}
                name="startDate"
                rules={{ required: "Vui lòng chọn ngày bắt đầu" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={value}
                    showClear={false}
                    onChange={onChange}
                    placeholder="Chọn ngày bắt đầu"
                    required
                    minDate={
                      watch("endDate")
                        ? new Date(watch("endDate") ?? "")
                        : new Date()
                    }
                    error={error?.message}
                    icon="calendar"
                  />
                )}
              />
            </View>

            <View>
              <Controller
                control={control}
                name="endDate"
                rules={{ required: "Vui lòng chọn ngày kết thúc" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <DatePicker
                    label="Ngày kết thúc (tùy chọn)"
                    value={value}
                    onChange={onChange}
                    placeholder="Chọn ngày kết thúc"
                    error={error?.message}
                    icon="calendar"
                    minDate={
                      watch("startDate")
                        ? new Date(watch("startDate") ?? "")
                        : new Date()
                    }
                  />
                )}
              />
            </View>
          </CardContent>

          <CardContent title="Thông tin thanh toán">
            <View className="mb-3">
              <Controller
                control={control}
                name="rentAmountAgreed"
                rules={{ required: "Vui lòng nhập tiền thuê hàng tháng" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="Tiền thuê hàng tháng"
                    value={value ? formatCurrency(value.toString()) : ""}
                    onChangeText={onChange}
                    placeholder="Nhập tiền thuê hàng tháng"
                    error={error?.message}
                    icon="cash"
                    keyboardType="numeric"
                    returnKeyType="done"
                    returnKeyLabel="Xong"
                  />
                )}
              />
            </View>

            <View className="mb-3">
              <Controller
                control={control}
                name="depositAmountPaid"
                rules={{ required: "Vui lòng nhập tiền cọc" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="Tiền cọc"
                    value={value ? formatCurrency(value.toString()) : ""}
                    onChangeText={onChange}
                    placeholder="Nhập tiền cọc"
                    error={error?.message}
                    icon="shield-checkmark"
                    keyboardType="numeric"
                    returnKeyType="done"
                    returnKeyLabel="Xong"
                  />
                )}
              />
            </View>

            <View className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <Text className="text-sm font-semibold text-blue-800 mb-1">
                Tổng tiền cọc (bao gồm dịch vụ):
              </Text>
              <Text className="text-lg font-bold text-blue-600">
                {formatCurrency("1000")}đ
              </Text>
            </View>
          </CardContent>

          <CardContent title="Dịch vụ bao gồm">
            <Controller
              control={control}
              name="contractServices"
              render={({ field: { value } }) => {
                console.log("💞💓💗💞💓💗 ~ value:", value);
                return (
                  <View className="flex-1 ">
                    {value?.map((service) => (
                      <View key={service.propertyServiceId} className="mb-3">
                        <Text style={{ color: "red" }}>{service.price}</Text>
                      </View>
                    ))}
                  </View>
                );
              }}
            />
            {!roomData?.services || roomData?.services.length === 0 ? (
              <View className="flex-row justify-center items-center py-4">
                <Text className="text-gray-500">Không có dịch vụ nào</Text>
              </View>
            ) : (
              <View className="flex-1">
                {getValues("contractServices")?.map((service) => (
                  <View key={service.propertyServiceId} className="mb-3">
                    <View key={service.id} className="mb-3">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <TouchableOpacity className="mr-3" onPress={() => {}}>
                            <Ionicons
                              name="checkbox"
                              size={20}
                              color={"#007AFF"}
                            />
                          </TouchableOpacity>
                          <View className="flex-1">
                            <Text className="text-base font-medium text-gray-900">
                              123
                            </Text>
                            <Text className="text-sm text-gray-600">
                              {formatCurrency(service.price.toString())}đ
                              {service.calculationMethod ===
                              ServiceCalculateMethod.PER_UNIT_SIMPLE
                                ? "/đơn vị"
                                : "/phòng/tháng"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </CardContent>

          {/* <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Dịch vụ bao gồm
          </Text>

          {isLoadingRoomData ? (
            <View className="flex-row justify-center items-center py-4">
              <Text className="text-gray-500">Đang tải dịch vụ...</Text>
            </View>
          ) : formData.services.length > 0 ? (
            formData.services.map((service, index) => (
              <View key={service.id} className="mb-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <TouchableOpacity
                      className="mr-3"
                      onPress={() =>
                        updateService(index, "isIncluded", !service.isIncluded)
                      }
                    >
                      <Ionicons
                        name={
                          service.isIncluded ? "checkbox" : "square-outline"
                        }
                        size={20}
                        color={service.isIncluded ? "#007AFF" : "#6B7280"}
                      />
                    </TouchableOpacity>
                    <View className="flex-1">
                      <Text className="text-base font-medium text-gray-900">
                        {service.name}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {formatCurrency(service.price)}đ
                        {service.calculationMethod ===
                        ServiceCalculateMethod.PER_UNIT_SIMPLE
                          ? "/đơn vị"
                          : "/phòng/tháng"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="flex-row justify-center items-center py-4">
              <Text className="text-gray-500">Không có dịch vụ nào</Text>
            </View>
          )}
        </View> */}

          <CardContent title="Điều khoảng bổ sung">
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (
                <Input
                  type="area"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Nhập điều khoảng bổ sung (tùy chọn)"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              )}
            />
          </CardContent>

          {/* <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-3">Ghi chú</Text>
          <View className="bg-gray-50 rounded-lg border border-gray-200">
            <TextInput
              className="p-3 text-base text-gray-900 min-h-[80px]"
              value={formData.notes}
              onChangeText={(value) => updateFormData("notes", value)}
              placeholder="Nhập ghi chú (tùy chọn)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View> */}
        </ScrollView>
      </KeyboardAwareScrollView>
      <ActionButtonBottom
        actions={[
          {
            label: "Tạo hợp đồng",
            icon: "checkmark-circle",
            isLoading,
            onPress: handleSave,
          },
        ]}
      />
      {/* <View className="bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl border border-gray-300 bg-white"
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Ionicons name="close" size={18} color="#6B7280" />
            <Text className="text-gray-600 font-semibold text-base ml-2">
              Hủy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl bg-blue-500"
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            )}
            <Text className="text-white font-semibold text-base ml-2">
              {isLoading ? "Đang lưu..." : "Tạo hợp đồng"}
            </Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Back Button */}
      {/* <TouchableOpacity
        className="absolute top-16 left-4 w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-md"
        onPress={() => navigation.goBack()}
        disabled={isLoading}
      >
        <Ionicons name="arrow-back" size={20} color="#374151" />
      </TouchableOpacity> */}
    </View>
  );
};

export default CreateContractScreen;
