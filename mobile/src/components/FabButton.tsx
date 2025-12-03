import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
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
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlassView style={[styles.fab]} glassEffectStyle="regular">
        <Ionicons
          name={icon}
          size={iconSize}
          color={colors.neutral.white}
          style={[styles.fabIcon, iconStyle]}
        />
      </GlassView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    // Dùng nền bán trong suốt để lộ hiệu ứng mờ phía sau
    // backgroundColor: "rgba(255,255,255,0.12)",
    // borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 8,
    elevation: 5,
  },
  fabIcon: {
    color: "#000",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2,
  },
});

export default FabButton;
