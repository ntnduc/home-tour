import { createStyles } from "@/styles/component/StyleInput";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: "text" | "number" | "area";
  formatMoney?: boolean;
  min?: number;
  max?: number;
  numberOfLines?: number;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  type = "text",
  formatMoney = false,
  min,
  max,
  numberOfLines = 1,
  keyboardType = "default",
}) => {
  const styles = createStyles;

  const formatCurrency = (text: string) => {
    if (!text) return "";
    const numericValue = text.replace(/[^0-9]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChangeText = (text: string) => {
    if (type === "number") {
      const numericValue = text.replace(/[^0-9]/g, "");
      const num = parseInt(numericValue);

      if (min !== undefined && num < min) {
        return;
      }
      if (max !== undefined && num > max) {
        return;
      }

      onChangeText(numericValue);
    } else if (formatMoney) {
      onChangeText(formatCurrency(text));
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.requiredText}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          type === "area" && { height: 100, textAlignVertical: "top" },
        ]}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        keyboardType={type === "number" ? "numeric" : keyboardType}
        multiline={type === "area"}
        numberOfLines={type === "area" ? numberOfLines : 1}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Input;
