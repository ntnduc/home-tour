import React from "react";
import { Text, View } from "react-native";
import { colors } from "../theme/colors";

interface ProgressBarProps {
  percentage: number;
  label: string;
  color?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  color = colors.primary.main,
  showPercentage = true,
}) => {
  return (
    <View className="mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm text-gray-600">{label}</Text>
        {showPercentage && (
          <Text className="text-sm font-semibold text-gray-800">
            {percentage}%
          </Text>
        )}
      </View>
      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
