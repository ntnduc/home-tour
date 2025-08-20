import ActionButtonBottom from "@/components/ActionButtonBottom";
import CardContent from "@/components/CardContent";
import DatePicker from "@/components/DatePicker";
import { useGlobalAppSheet } from "@/components/GlobalAppSheet";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { ContractService } from "@/types/contract-service";
import { formatCurrency, generateId } from "@/utils/appUtil";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import { getRoomService } from "../../api/room/room.api";
import { ContractCreateRequest } from "../../types/contract";
import { RoomServiceDetailResponse, RoomStatus } from "../../types/room";
import CardComponent from "../common/CardComponent";
import ContractServiceComponent from "./components/ContractServiceComponent";
import ServiceItem from "./components/ServiceItem";

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

  const { openAppSheet } = useGlobalAppSheet();

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
      contractServices: roomData?.services.map((service, index) => ({
        id: service?.id ?? index.toString(),
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

  const openServiceForm = (service?: ContractService, isNew?: boolean) => {
    console.log("💞💓💗💞💓💗 ~ openServiceForm ~ service:", service);
    openAppSheet(<ContractServiceComponent />, {
      header: {
        title: isNew ? "Thêm dịch vụ" : "Cập nhật dịch vụ",
      },
      closeSnapPointStraightEnabled: true,
      modalHeight: 700,
    });
  };

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
                name: service.name,
                isSelectedFromService: false,
                price: service.price,
                propertyServiceId: service.propertyServiceId,
                calculationMethod: service.calculationMethod,
                notes: "",
              })
            ) as ContractService[];
            setValue("contractServices", contractServices);
            setValue("rentAmountAgreed", roomServiceResponse.data.rentAmount);
            setValue(
              "depositAmountPaid",
              roomServiceResponse.data.defaultDepositAmount
            );
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

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

  return (
    <View className="flex-1 bg-gray-50">
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
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
              }) => {
                return (
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
                    required
                    showClear={false}
                  />
                );
              }}
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

        <CardComponent
          title={
            <View>
              <Text className="text-[#1F2937] font-semibold text-[17px]">
                Dịch vụ
              </Text>
            </View>
          }
          description="Quản lý các dịch vụ cho hợp đồng"
          renderActions={() => {
            return (
              <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity
                  onPress={() => {
                    openServiceForm(undefined, true);
                  }}
                  className="flex-row items-center bg-blue-500 px-4 py-2 rounded-xl shadow-sm"
                  style={{
                    shadowColor: "#3B82F6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Ionicons name="add-circle" size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    Thêm dịch vụ
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        >
          <Controller
            control={control}
            name="contractServices"
            render={({ field: { value, onChange } }) => {
              if (!value || value.length === 0) {
                return (
                  <View className="flex-1 items-center justify-center py-12">
                    <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3">
                      <Ionicons
                        name="construct-outline"
                        size={24}
                        color="#9CA3AF"
                      />
                    </View>
                    <Text className="text-gray-500 text-base mb-2">
                      Chưa có dịch vụ nào
                    </Text>
                    <Text className="text-gray-400 text-sm text-center">
                      Nhấn "Thêm dịch vụ" để bắt đầu
                    </Text>
                  </View>
                );
              }

              return (
                <View key={generateId()} className="space-y-3">
                  {value?.map((service, index) => (
                    <View key={`service-${service.id || index}-${index}`}>
                      <ServiceItem
                        key={`service-item-${service.id || index}-${index}`}
                        service={service}
                        index={index}
                        onEdit={() => openServiceForm(service, false)}
                        onChange={(service) => {
                          onChange(
                            value.map((s, i) => (i === index ? service : s))
                          );
                        }}
                      />
                    </View>
                  ))}
                </View>
              );
            }}
          />

          <View className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-medium text-blue-700 mb-1">
                  Tổng tiền dịch vụ hàng tháng
                </Text>
                <Text className="text-xs text-blue-600">
                  Bao gồm tất cả dịch vụ đã chọn
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    getValues("contractServices")
                      ?.filter((service) => service.isEnabled)
                      .reduce(
                        (total, service) => total + (service.price || 0),
                        0
                      )
                      .toString() || "0"
                  )}
                  đ
                </Text>
                <Text className="text-xs text-blue-500">/tháng</Text>
              </View>
            </View>
          </View>
        </CardComponent>

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
    </View>
  );
};

export default CreateContractScreen;
