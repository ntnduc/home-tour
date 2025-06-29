import { colors } from "@/theme/colors";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type CardComponentProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

const CardComponent = (props: CardComponentProps) => {
  const { children, style, className } = props;
  return (
    <View
      style={[styles.card, style]}
      className={`rounded-xl p-4 mb-4 ${className}`}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.default,
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
});

export default CardComponent;
