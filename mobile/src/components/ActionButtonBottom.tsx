import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme as useTamaguiTheme } from "tamagui";

interface ActionButton {
  label: string;
  onPress: () => void | Promise<void>;
  icon?: keyof typeof Ionicons.glyphMap;
  iconElement?: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  disabled?: boolean;
  customStyle?: ViewStyle;
}

interface ActionButtonBottomProps {
  actions: ActionButton[];
  containerStyle?: ViewStyle;
  className?: string;
}

const getButtonStyle = (
  variant: ActionButton["variant"] = "primary",
  customStyle?: ViewStyle
) => {
  const baseStyle =
    "flex-row items-center justify-center py-4 px-6 rounded-xl shadow-sm";

  const variantStyles = {
    primary: "bg-blue-600",
    secondary: "bg-white border border-gray-300",
    danger: "bg-red-600",
  };

  return `${baseStyle} ${variantStyles[variant]} ${customStyle || ""}`;
};

const getTextStyle = (variant: ActionButton["variant"] = "primary") => {
  const baseStyle = "font-semibold text-base ml-2 ";

  const variantStyles = {
    primary: "text-white",
    secondary: "text-gray-600 font-medium text-sm",
    danger: "text-white",
  };

  return `${baseStyle} ${variantStyles[variant]}`;
};

const getIconColor = (variant: ActionButton["variant"] = "primary") => {
  const colors = {
    primary: "#FFFFFF",
    secondary: "#6B7280",
    danger: "#FFFFFF",
  };
  return colors[variant];
};

const ActionButtonBottom: React.FC<ActionButtonBottomProps> = ({
  actions,
  containerStyle,
  className,
}) => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTamaguiTheme();
  return (
    <View
      className={`bg-white border-t border-gray-200 px-6 pt-3 ${className}`}
      style={[
        { backgroundColor: theme.background?.val ?? "#fff" },
        containerStyle,
        { paddingBottom: bottom },
      ]}
    >
      {actions.map((action, index) => (
        <TouchableOpacity
          key={`${action.label}-${index}`}
          className={getButtonStyle(action.variant, action.customStyle)}
          onPress={action.onPress}
          disabled={action.disabled || action.isLoading}
          style={[index !== actions.length - 1 && { marginBottom: 12 }]}
        >
          {action.isLoading ? (
            <ActivityIndicator
              color={getIconColor(action.variant)}
              size="small"
            />
          ) : (
            <>
              {action.iconElement
                ? action.iconElement
                : action.icon && (
                    <Ionicons
                      name={action.icon}
                      size={18}
                      color={getIconColor(action.variant)}
                    />
                  )}
            </>
          )}
          <Text className={getTextStyle(action.variant)}>
            {action.isLoading ? "Đang xử lý..." : action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ActionButtonBottom;
