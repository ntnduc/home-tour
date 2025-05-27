import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, bgColor }) => (
  <View style={[styles.card, { backgroundColor: bgColor }]}>
    {icon}
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    margin: 8,
    alignItems: "flex-start",
    minWidth: 140,
    minHeight: 100,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});

export default StatCard;
