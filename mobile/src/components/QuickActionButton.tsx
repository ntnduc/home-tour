import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  gradient?: boolean;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  icon,
  onPress,
  gradient,
}) => (
  <TouchableOpacity
    style={[styles.button, gradient && styles.gradient]}
    onPress={onPress}
  >
    <View style={styles.icon}>{icon}</View>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    margin: 8,
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    elevation: 2,
  },
  gradient: {
    backgroundColor: "#6a5af9", // Đơn giản hóa, nếu muốn gradient thực sự thì dùng LinearGradient
  },
  icon: {
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#222",
  },
});

export default QuickActionButton;
