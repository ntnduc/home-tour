import { createStyles } from "@/styles/component/StyleInput";
import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { Switch as RNSwitch, Text, View } from "react-native";
import { SwitchProps } from "./types";

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  description,
  error,
  required = false,
  disabled = false,
  size = "medium",
  activeColor,
  inactiveColor,
  thumbColor,
  containerStyle,
  labelStyle,
  alignLabel = "vertical",
  descriptionStyle,
  errorStyle,
  containerClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // Tính toán size cho switch
  const getSwitchSize = () => {
    switch (size) {
      case "small":
        return { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] };
      case "large":
        return { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] };
      default:
        return {};
    }
  };

  // Tính toán màu sắc
  const getActiveColor = () => {
    if (activeColor) return activeColor;
    if (error) return "#ff3b30";
    return "#007AFF";
  };

  const getInactiveColor = () => {
    if (inactiveColor) return inactiveColor;
    return "#E5E7EB";
  };

  const getThumbColor = () => {
    if (thumbColor) return thumbColor;
    return "#FFFFFF";
  };

  // Style cho description
  const descriptionStyles = {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    ...(descriptionStyle as object),
  };

  // Style cho error text
  const errorStyles = {
    fontSize: 14,
    color: "#ff3b30",
    marginTop: 4,
    ...(errorStyle as object),
  };

  return (
    <View
      style={[{ marginVertical: 8 }, containerStyle]}
      className={containerClassName}
      testID={testID}
    >
      <View
        className={`flex-row  ${
          alignLabel === "horizontal"
            ? "flex-row items-center align-center"
            : "flex-col"
        }`}
      >
        <View className="mr-4">
          {label && (
            <Text
              style={[
                styles.label,
                labelStyle,
                { marginBottom: alignLabel === "horizontal" ? 0 : 8 },
              ]}
              className={labelClassName}
            >
              {label}
              {required && <Text style={styles.requiredText}> *</Text>}
            </Text>
          )}
          {description && (
            <Text style={descriptionStyles} className={descriptionClassName}>
              {description}
            </Text>
          )}
        </View>

        <RNSwitch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: getInactiveColor(),
            true: getActiveColor(),
          }}
          thumbColor={getThumbColor()}
          ios_backgroundColor={getInactiveColor()}
          style={getSwitchSize()}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityRole="switch"
          accessibilityState={{
            checked: value,
            disabled: disabled,
          }}
        />
      </View>

      {error && (
        <Text style={errorStyles} className={errorClassName}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Switch;
