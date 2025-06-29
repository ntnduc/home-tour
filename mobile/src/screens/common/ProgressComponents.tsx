import { colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ProgressComponentsProps = {
  occupancyRate: number;
  label: string;
};

const ProgressComponents = (props: ProgressComponentsProps) => {
  const { occupancyRate, label } = props;

  return (
    <View style={styles.progressSection}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressPercent}>{occupancyRate}%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${occupancyRate}%`,
              backgroundColor:
                occupancyRate === 100
                  ? colors.status.success
                  : colors.status.error,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  progressLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  progressBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: colors.border.light,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "600",
  },
});

export default ProgressComponents;
