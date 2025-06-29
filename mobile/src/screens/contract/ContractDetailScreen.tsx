import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  Contract,
  CONTRACT_STATUS_COLOR,
  CONTRACT_STATUS_LABEL,
  ContractStatus,
} from "../../types/contract";

type RootStackParamList = {
  ContractDetail: { contract: Contract };
  TerminateContract: { contract: Contract };
  RoomList: undefined;
};

type ContractDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: { params: { contract: Contract } };
};

const ContractDetailScreen = ({
  navigation,
  route,
}: ContractDetailScreenProps) => {
  const { contract } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date(contract.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: ContractStatus) => {
    return CONTRACT_STATUS_COLOR[status] || { bg: "#F3F4F6", color: "#6B7280" };
  };

  const handleTerminateContract = () => {
    Alert.alert(
      "Xác nhận kết thúc hợp đồng",
      `Bạn có chắc chắn muốn kết thúc hợp đồng với ${contract.tenantName}?\n\nHành động này sẽ chuyển phòng về trạng thái trống.`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Kết thúc",
          style: "destructive",
          onPress: () => navigation.navigate("TerminateContract", { contract }),
        },
      ]
    );
  };

  const handleRenewContract = () => {
    Alert.alert(
      "Gia hạn hợp đồng",
      "Tính năng gia hạn hợp đồng sẽ được phát triển trong phiên bản tiếp theo.",
      [{ text: "OK" }]
    );
  };

  const canTerminate = contract.status === ContractStatus.ACTIVE;
  const canRenew =
    contract.status === ContractStatus.ACTIVE && getDaysRemaining() <= 30;
  const daysRemaining = getDaysRemaining();

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
      >
        {/* Header với thông tin hợp đồng */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-1">
                Hợp đồng #{contract.id}
              </Text>
              <Text className="text-sm text-gray-600">
                {contract.roomName} - {contract.buildingName}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full`}
              style={{ backgroundColor: getStatusColor(contract.status).bg }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: getStatusColor(contract.status).color }}
              >
                {CONTRACT_STATUS_LABEL[contract.status]}
              </Text>
            </View>
          </View>

          {/* Thông tin người thuê */}
          <View className="bg-gray-50 rounded-lg p-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Người thuê
            </Text>
            <Text className="text-base font-medium text-gray-900 mb-1">
              {contract.tenantName}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              📞 {contract.tenantPhone}
            </Text>
            {contract.tenantEmail && (
              <Text className="text-sm text-gray-600 mb-1">
                📧 {contract.tenantEmail}
              </Text>
            )}
            <Text className="text-sm text-gray-600">
              🆔 {contract.tenantIdCard}
            </Text>
          </View>
        </View>

        {/* Thông tin thời hạn */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Thời hạn hợp đồng
          </Text>

          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-sm text-gray-600 mb-1">Ngày bắt đầu</Text>
              <Text className="text-base font-semibold text-gray-900">
                {formatDate(contract.startDate)}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#6B7280" />
            <View className="flex-1 items-end">
              <Text className="text-sm text-gray-600 mb-1">Ngày kết thúc</Text>
              <Text className="text-base font-semibold text-gray-900">
                {formatDate(contract.endDate)}
              </Text>
            </View>
          </View>

          {contract.status === ContractStatus.ACTIVE && (
            <View
              className={`rounded-lg p-3 border ${
                daysRemaining <= 7
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <Text
                className={`text-sm font-semibold mb-1 ${
                  daysRemaining <= 7 ? "text-yellow-800" : "text-blue-800"
                }`}
              >
                Thời gian còn lại:
              </Text>
              <Text
                className={`text-base font-bold ${
                  daysRemaining <= 7 ? "text-yellow-600" : "text-blue-600"
                }`}
              >
                {daysRemaining > 0
                  ? `${daysRemaining} ngày`
                  : "Hết hạn hôm nay"}
              </Text>
            </View>
          )}
        </View>

        {/* Thông tin thanh toán */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Thông tin thanh toán
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">
                Tiền thuê hàng tháng
              </Text>
              <Text className="text-base font-semibold text-gray-900">
                {formatCurrency(contract.monthlyRent)}đ
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Tiền cọc</Text>
              <Text className="text-base font-semibold text-gray-900">
                {formatCurrency(contract.deposit)}đ
              </Text>
            </View>

            <View className="border-t border-gray-200 pt-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-semibold text-gray-900">
                  Tổng tiền cọc
                </Text>
                <Text className="text-lg font-bold text-blue-600">
                  {formatCurrency(
                    contract.deposit +
                      contract.services
                        .filter((service) => service.isIncluded)
                        .reduce((sum, service) => sum + service.price, 0)
                  )}
                  đ
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dịch vụ bao gồm */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Dịch vụ bao gồm
          </Text>

          {contract.services.map((service) => (
            <View
              key={service.id}
              className="flex-row items-center justify-between mb-3 last:mb-0"
            >
              <View className="flex-row items-center flex-1">
                <Ionicons
                  name={
                    service.isIncluded ? "checkmark-circle" : "close-circle"
                  }
                  size={20}
                  color={service.isIncluded ? "#34C759" : "#FF3B30"}
                  className="mr-3"
                />
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-900">
                    {service.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {formatCurrency(service.price)}đ
                    {service.calculationMethod === "PER_UNIT_SIMPLE"
                      ? "/đơn vị"
                      : "/phòng/tháng"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Thông tin bổ sung */}
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Thông tin bổ sung
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Ngày tạo</Text>
              <Text className="text-sm font-medium text-gray-900">
                {formatDate(contract.createdAt)}
              </Text>
            </View>

            {contract.signedAt && (
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-600">Ngày ký</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {formatDate(contract.signedAt)}
                </Text>
              </View>
            )}

            {contract.terminatedAt && (
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-600">Ngày kết thúc</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {formatDate(contract.terminatedAt)}
                </Text>
              </View>
            )}

            {contract.terminationReason && (
              <View>
                <Text className="text-sm text-gray-600 mb-1">
                  Lý do kết thúc
                </Text>
                <Text className="text-sm font-medium text-gray-900">
                  {contract.terminationReason}
                </Text>
              </View>
            )}

            {contract.notes && (
              <View>
                <Text className="text-sm text-gray-600 mb-1">Ghi chú</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {contract.notes}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons - Bottom Sheet Style */}
      {(canTerminate || canRenew) && (
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

            {/* Renew Button */}
            {canRenew && (
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl bg-green-500"
                onPress={handleRenewContract}
                disabled={isLoading}
              >
                <Ionicons name="refresh" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-base ml-2">
                  Gia hạn
                </Text>
              </TouchableOpacity>
            )}

            {/* Terminate Button */}
            {canTerminate && (
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl bg-red-500"
                onPress={handleTerminateContract}
                disabled={isLoading}
              >
                <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-base ml-2">
                  Kết thúc
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

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

export default ContractDetailScreen;
