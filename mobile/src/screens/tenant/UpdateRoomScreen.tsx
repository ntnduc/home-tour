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

type RootStackParamList = {
  UpdateRoom: { room: any };
  RoomList: undefined;
};

type UpdateRoomScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: { params: { room: any } };
};

const UpdateRoomScreen = ({ navigation, route }: UpdateRoomScreenProps) => {
  const { room } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: room.name,
    building: room.building,
    price: room.price.toString(),
    area: room.area.toString(),
    description: room.description || "",
    status: room.status,
    maxTenants: room.tenants || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên phòng không được để trống";
    }

    if (!formData.building.trim()) {
      newErrors.building = "Tòa nhà không được để trống";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Giá thuê phải lớn hơn 0";
    }

    if (!formData.area || parseFloat(formData.area) <= 0) {
      newErrors.area = "Diện tích phải lớn hơn 0";
    }

    if (parseInt(formData.maxTenants) < 0) {
      newErrors.maxTenants = "Số người thuê không được âm";
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
      // TODO: Gọi API cập nhật phòng
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      Alert.alert("Thành công", "Đã cập nhật thông tin phòng thành công!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("RoomList"),
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin phòng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa phòng "${room.name}"?\n\nHành động này không thể hoàn tác.`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
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
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Header */}
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
                <View
                  className={`px-3 py-1 rounded-full ${getStatusBgClass(room.status)}`}
                >
                  <Text
                    className={`text-xs font-semibold ${getStatusTextClass(room.status)}`}
                  >
                    {room.status}
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-xs text-gray-500 mb-1">Giá hiện tại</Text>
              <Text className="text-lg font-bold text-blue-600">
                {room.price.toLocaleString()}đ
              </Text>
            </View>
          </View>
        </View>

        {/* Compact Form */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Thông tin cơ bản
          </Text>

          {/* Tên phòng */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Tên phòng *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            >
              <Ionicons
                name="home"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                placeholder="Nhập tên phòng"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.name && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.name}
              </Text>
            )}
          </View>

          {/* Tòa nhà */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Tòa nhà *
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.building ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            >
              <Ionicons
                name="business"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.building}
                onChangeText={(value) => updateFormData("building", value)}
                placeholder="Nhập tên tòa nhà"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {errors.building && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.building}
              </Text>
            )}
          </View>

          {/* Giá và Diện tích - 2 cột */}
          <View className="flex-row gap-3">
            <View className="flex-1 mb-3">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Giá thuê *
              </Text>
              <View
                className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.price ? "border-red-300 bg-red-50" : "border-gray-200"}`}
              >
                <Ionicons
                  name="cash"
                  size={18}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-base text-gray-900"
                  value={formData.price}
                  onChangeText={(value) =>
                    updateFormData("price", value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="VNĐ/tháng"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              {errors.price && (
                <Text className="text-xs text-red-500 mt-1 ml-1">
                  {errors.price}
                </Text>
              )}
            </View>

            <View className="flex-1 mb-3">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Diện tích *
              </Text>
              <View
                className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.area ? "border-red-300 bg-red-50" : "border-gray-200"}`}
              >
                <Ionicons
                  name="resize"
                  size={18}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-base text-gray-900"
                  value={formData.area}
                  onChangeText={(value) =>
                    updateFormData("area", value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="m²"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              {errors.area && (
                <Text className="text-xs text-red-500 mt-1 ml-1">
                  {errors.area}
                </Text>
              )}
            </View>
          </View>

          {/* Số người thuê */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Số người thuê tối đa
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border ${errors.maxTenants ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            >
              <Ionicons
                name="people"
                size={18}
                color="#6B7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-base text-gray-900"
                value={formData.maxTenants.toString()}
                onChangeText={(value) =>
                  updateFormData("maxTenants", value.replace(/[^0-9]/g, ""))
                }
                placeholder="Nhập số người tối đa"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
            {errors.maxTenants && (
              <Text className="text-xs text-red-500 mt-1 ml-1">
                {errors.maxTenants}
              </Text>
            )}
          </View>
        </View>

        {/* Trạng thái - Compact */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
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
        </View>

        {/* Mô tả - Compact */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-3">Mô tả</Text>
          <View className="bg-gray-50 rounded-lg border border-gray-200">
            <TextInput
              className="p-3 text-base text-gray-900 min-h-[80px]"
              value={formData.description}
              onChangeText={(value) => updateFormData("description", value)}
              placeholder="Nhập mô tả về phòng (tùy chọn)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Compact Action Buttons */}
      <View className="p-4 bg-white border-t border-gray-200">
        {/* Primary Action - Save Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center py-4 px-6 rounded-xl bg-blue-600 mb-3 shadow-sm"
          onPress={handleSave}
          disabled={isLoading}
        >
          <Ionicons
            name={isLoading ? "hourglass" : "checkmark-circle"}
            size={20}
            color="#FFFFFF"
          />
          <Text className="text-white font-semibold text-base ml-2">
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Text>
        </TouchableOpacity>

        {/* Secondary Action - Delete Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center py-3 px-6 rounded-xl border border-gray-300 bg-white"
          onPress={handleDelete}
          disabled={isLoading}
        >
          <Ionicons name="trash-outline" size={18} color="#6B7280" />
          <Text className="text-gray-600 font-medium text-sm ml-2">
            Xóa phòng
          </Text>
        </TouchableOpacity>
      </View>
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
