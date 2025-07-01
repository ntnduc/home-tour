import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type FabButtonProps = {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

const FabButton = ({
  icon,
  onPress,
  iconSize = 24,
  iconStyle,
  style,
}: FabButtonProps) => {
  return (
    <TouchableOpacity style={[styles.fab, style]} onPress={onPress}>
      <Ionicons
        name={icon}
        size={iconSize}
        color={colors.neutral.white}
        style={[styles.fabIcon, iconStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: colors.primary.main + "95",
    borderWidth: 1,
    borderColor: colors.primary.main,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary.main,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  fabIcon: {
    color: colors.neutral.white,
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2,
  },
});

export default FabButton;
