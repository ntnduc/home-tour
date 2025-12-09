import React from "react";
import { StyleProp, Text, TextStyle, View } from "react-native";
import { createStyles } from "../styles/component/StyleInput";
import { useTheme } from "../theme/ThemeProvider";

export interface LabelProps {
  label: string;
  required?: boolean;
  labelStyles?: StyleProp<TextStyle>;
  labelClassName?: string;
}

const LabelForm = ({
  label,
  required,
  labelStyles,
  labelClassName,
}: LabelProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View>
      <Text style={[styles.label, labelStyles]} className={labelClassName}>
        {label}
        {required && <Text style={styles.requiredText}> *</Text>}
      </Text>
    </View>
  );
};

export default LabelForm;
