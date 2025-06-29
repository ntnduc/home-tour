import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ServiceCalculateMethod } from "../../constant/service.constant";
import { ContractCreateRequest } from "../../types/contract";

type RootStackParamList = {
  CreateContract: { room: any };
  RoomList: undefined;
};

type CreateContractScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: { params: { room: any } };
};

const CreateContractScreen = ({
  navigation,
  route,
}: CreateContractScreenProps) => {
  const { room } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ContractCreateRequest>({
    roomId: room.id,
    tenantName: "",
    tenantPhone: "",
    tenantEmail: "",
    tenantIdCard: "",
    tenantAddress: "",
    startDate: "",
    endDate: "",
    monthlyRent: room.price,
    deposit: room.price,
    services: [
      {
        id: 1,
        name: "Điện",
        price: 3500,
        calculationMethod: ServiceCalculateMethod.PER_UNIT_SIMPLE,
        isIncluded: true,
      },
      {
        id: 2,
        name: "Nước",
        price: 15000,
        calculationMethod: ServiceCalculateMethod.PER_UNIT_SIMPLE,
        isIncluded: true,
      },
      {
        id: 3,
        name: "Wifi",
        price: 100000,
        calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
        isIncluded: true,
      },
      {
        id: 4,
        name: "Gửi xe",
        price: 25000,
        calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
        isIncluded: true,
      },
    ],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenantName.trim()) {
      newErrors.tenantName = "Tên người thuê không được để trống";
    }

    if (!formData.tenantPhone.trim()) {
      newErrors.tenantPhone = "Số điện thoại không được để trống";
    } else if (
      !/^[0-9]{10,11}$/.test(formData.tenantPhone.replace(/\s/g, ""))
    ) {
      newErrors.tenantPhone = "Số điện thoại không hợp lệ";
    }

    if (formData.tenantEmail && !/\S+@\S+\.\S+/.test(formData.tenantEmail)) {
      newErrors.tenantEmail = "Email không hợp lệ";
    }

    if (!formData.tenantIdCard.trim()) {
      newErrors.tenantIdCard = "CMND/CCCD không được để trống";
    } else if (
      !/^[0-9]{9,12}$/.test(formData.tenantIdCard.replace(/\s/g, ""))
    ) {
      newErrors.tenantIdCard = "CMND/CCCD không hợp lệ";
    }

    if (!formData.tenantAddress.trim()) {
      newErrors.tenantAddress = "Địa chỉ không được để trống";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống";
    } else if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    if (formData.monthlyRent <= 0) {
      newErrors.monthlyRent = "Tiền thuê phải lớn hơn 0";
    }

    if (formData.deposit < 0) {
      newErrors.deposit = "Tiền cọc không được âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin");
      return;
    }

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

  const updateFormData = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const updateService = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  const calculateTotalDeposit = () => {
    return (
      formData.deposit +
      formData.services
        .filter((service) => service.isIncluded)
        .reduce((sum, service) => sum + service.price, 0)
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
      >
        {/* Header với thông tin phòng */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-1">
                {room.name}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">
                {room.building}
              </Text>
              <View className="flex-row items-center">
                <View className="px-3 py-1 rounded-full bg-orange-100">
                  <Text className="text-xs font-semibold text-orange-700">
                    Trống
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-xs text-gray-500 mb-1">Giá thuê</Text>
              <Text className="text-lg font-bold text-blue-600">
                {formatCurrency(room.price)}đ/tháng
              </Text>
            </View>
          </View>
        </View>

        {/* Thông tin người thuê */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Thông tin người thuê
          </Text>

          {/* Tên người thuê */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Họ và tên *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.tenantName ? "border-red-300 bg-red-50" : "border-gray-200"}`}
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

          {/* Số điện thoại */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Số điện thoại *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.tenantPhone ? "border-red-300 bg-red-50" : "border-gray-200"}`}
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

          {/* Email */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Email
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.tenantEmail ? "border-red-300 bg-red-50" : "border-gray-200"}`}
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

          {/* CMND/CCCD */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              CMND/CCCD *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.tenantIdCard ? "border-red-300 bg-red-50" : "border-gray-200"}`}
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

          {/* Địa chỉ */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Địa chỉ *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.tenantAddress ? "border-red-300 bg-red-50" : "border-gray-200"}`}
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
        </View>

        {/* Thời hạn thuê */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Thời hạn thuê
          </Text>

          {/* Ngày bắt đầu */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Ngày bắt đầu *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.startDate ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            >
              <Ionicons
                name="calendar"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.startDate}
                onChangeText={(value) => updateFormData("startDate", value)}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.startDate && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.startDate}
              </Text>
            )}
          </View>

          {/* Ngày kết thúc */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Ngày kết thúc *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.endDate ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            >
              <Ionicons
                name="calendar"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.endDate}
                onChangeText={(value) => updateFormData("endDate", value)}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.endDate && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.endDate}
              </Text>
            )}
          </View>
        </View>

        {/* Thông tin thanh toán */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Thông tin thanh toán
          </Text>

          {/* Tiền thuê hàng tháng */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Tiền thuê hàng tháng *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.monthlyRent ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            >
              <Ionicons
                name="cash"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.monthlyRent.toString()}
                onChangeText={(value) =>
                  updateFormData(
                    "monthlyRent",
                    parseInt(value.replace(/[^0-9]/g, "")) || 0
                  )
                }
                placeholder="VNĐ/tháng"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
            {errors.monthlyRent && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.monthlyRent}
              </Text>
            )}
          </View>

          {/* Tiền cọc */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Tiền cọc
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.deposit ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            >
              <Ionicons
                name="shield-checkmark"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.deposit.toString()}
                onChangeText={(value) =>
                  updateFormData(
                    "deposit",
                    parseInt(value.replace(/[^0-9]/g, "")) || 0
                  )
                }
                placeholder="VNĐ"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
            {errors.deposit && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.deposit}
              </Text>
            )}
          </View>

          {/* Tổng tiền cọc */}
          <View className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <Text className="text-sm font-semibold text-blue-800 mb-1">
              Tổng tiền cọc (bao gồm dịch vụ):
            </Text>
            <Text className="text-lg font-bold text-blue-600">
              {formatCurrency(calculateTotalDeposit())}đ
            </Text>
          </View>
        </View>

        {/* Dịch vụ bao gồm */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Dịch vụ bao gồm
          </Text>

          {formData.services.map((service, index) => (
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
                      name={service.isIncluded ? "checkbox" : "square-outline"}
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
          ))}
        </View>

        {/* Ghi chú */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
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
        </View>
      </ScrollView>

      {/* Action Buttons - Bottom Sheet Style */}
      <View className="bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex-row gap-3">
          {/* Cancel Button */}
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

          {/* Save Button */}
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
      </View>

      {/* Back Button */}
      <TouchableOpacity
        className="absolute top-16 left-4 w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-md"
        onPress={() => navigation.goBack()}
        disabled={isLoading}
      >
        <Ionicons name="arrow-back" size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};

export default CreateContractScreen;
