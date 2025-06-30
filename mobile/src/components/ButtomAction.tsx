import { colors } from "@/theme/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type ButtonType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "success";

interface ButtonActionProps extends TouchableOpacityProps {
  icon?: keyof typeof Ionicons.glyphMap;
  text: string;
  type?: ButtonType;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  iconStyle?: TextStyle;
}

const ButtonAction = ({
  icon,
  text,
  type = "primary",
  onPress,
  textStyle,
  containerStyle,
  iconStyle,
  ...rest
}: ButtonActionProps) => {
  return (
    <TouchableOpacity
      style={[styles.base, styles[type], containerStyle]}
      onPress={onPress}
      activeOpacity={0.8}
      {...rest}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={styles[`${type}Text`].color as string}
          style={[
            styles.iconBase,
            { color: styles[`${type}Text`].color as string },
            iconStyle,
          ]}
        />
      )}
      <Text style={[styles.textBase, styles[`${type}Text`], textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
    gap: 4,
  },
  iconBase: {
    fontSize: 12,
    color: colors.primary.main,
    fontWeight: "500",
  },
  primary: {
    backgroundColor: colors.primary.main,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  primaryText: {
    color: colors.neutral.white,
  },
  secondary: {
    backgroundColor: colors.primary.light,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  secondaryText: {
    color: colors.primary.main,
  },
  tertiary: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  tertiaryText: {
    color: colors.text.primary,
  },
  danger: {
    backgroundColor: colors.status.error,
    borderWidth: 1,
    borderColor: colors.status.error,
  },
  dangerText: {
    color: colors.neutral.white,
  },
  success: {
    backgroundColor: colors.status.success + "10",
    borderWidth: 1,
    borderColor: colors.status.success + "30",
  },
  successText: {
    color: colors.status.success,
  },
  textBase: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default ButtonAction;
