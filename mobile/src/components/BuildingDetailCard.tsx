import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import ProgressBar from "./ProgressBar";

interface BuildingDetailCardProps {
  building: {
    id: number;
    name: string;
    revenue: number;
    occupancy: number;
    rooms: number;
    occupied: number;
    status: string;
    address?: string;
    monthlyGrowth?: number;
    avgRent?: number;
  };
  onPress?: () => void;
}

const BuildingDetailCard: React.FC<BuildingDetailCardProps> = ({
  building,
  onPress,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return {
          bg: colors.status.success + "20",
          text: colors.status.success,
        };
      case "maintenance":
        return {
          bg: colors.status.warning + "20",
          text: colors.status.warning,
        };
      case "inactive":
        return { bg: colors.status.error + "20", text: colors.status.error };
      default:
        return { bg: colors.neutral.gray[200], text: colors.text.secondary };
    }
  };

  const statusStyle = getStatusColor(building.status);

  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-4 shadow-sm"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {building.name}
          </Text>
          {building.address && (
            <Text className="text-sm text-gray-500">{building.address}</Text>
          )}
        </View>
        <View
          className={`px-2 py-1 rounded-full`}
          style={{ backgroundColor: statusStyle.bg }}
        >
          <Text
            className={`text-xs font-medium`}
            style={{ color: statusStyle.text }}
          >
            {building.status === "active"
              ? "Hoạt động"
              : building.status === "maintenance"
                ? "Bảo trì"
                : "Không hoạt động"}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-3">
        <View>
          <Text className="text-gray-600 text-sm">Doanh thu tháng</Text>
          <Text className="text-lg font-bold text-primary-main">
            {(building.revenue / 1000000).toFixed(1)}M
          </Text>
        </View>
        <View>
          <Text className="text-gray-600 text-sm">Tỷ lệ lấp đầy</Text>
          <Text className="text-lg font-bold text-status-success">
            {building.occupancy}%
          </Text>
        </View>
      </View>

      <ProgressBar
        percentage={building.occupancy}
        label="Tỷ lệ lấp đầy"
        color={colors.primary.main}
      />

      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-gray-600 text-sm">Phòng đã thuê</Text>
          <Text className="text-base font-semibold">
            {building.occupied}/{building.rooms}
          </Text>
        </View>
        <View>
          <Text className="text-gray-600 text-sm">Phòng trống</Text>
          <Text className="text-base font-semibold text-status-warning">
            {building.rooms - building.occupied}
          </Text>
        </View>
      </View>

      {building.monthlyGrowth && (
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-600 text-sm">Tăng trưởng tháng</Text>
          <View className="flex-row items-center">
            <Text
              className={`text-sm font-semibold mr-1 ${
                building.monthlyGrowth > 0
                  ? "text-status-success"
                  : "text-status-error"
              }`}
            >
              {building.monthlyGrowth > 0 ? "+" : ""}
              {building.monthlyGrowth}%
            </Text>
            <Text className="text-sm text-gray-500">
              {building.monthlyGrowth > 0 ? "↑" : "↓"}
            </Text>
          </View>
        </View>
      )}

      {building.avgRent && (
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600 text-sm">Tiền phòng TB</Text>
          <Text className="text-base font-semibold text-primary-main">
            {building.avgRent.toLocaleString()} VNĐ
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BuildingDetailCard;
