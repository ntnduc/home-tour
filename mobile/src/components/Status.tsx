import { colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

export type StatusType = "success" | "warning" | "error" | "info" | "default";

type Props = {
  type: StatusType;
  label?: string;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  className?: string;
  textClassName?: string;
};

const Status = ({
  type,
  label,
  style,
  containerStyle,
  className,
  textClassName,
}: Props) => {
  return (
    <View
      style={[styles.container, styles[type], containerStyle, style]}
      className={className}
    >
      <Text
        style={[styles.text, styles[`text_${type}`]]}
        className={textClassName}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 80,
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
  text_success: {
    color: colors.status.success,
  },
  text_warning: {
    color: colors.status.warning,
  },
  text_error: {
    color: colors.status.error,
  },
  text_info: {
    color: colors.status.info,
  },
  text_default: {
    color: colors.status.success,
  },
  success: {
    backgroundColor: colors.status.success + "20",
  },
  warning: {
    backgroundColor: colors.status.warning + "20",
  },
  error: {
    backgroundColor: colors.status.error + "20",
  },
  info: {
    backgroundColor: colors.status.info + "20",
  },
  default: {
    backgroundColor: colors.status.success + "20",
  },
});

export default Status;
