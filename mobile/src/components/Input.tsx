import { createStyles } from "@/styles/component/StyleInput";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  Text,
  TextInput,
  TextInputFocusEventData,
  View,
  ViewStyle,
} from "react-native";
import { useTheme as useTamaguiTheme } from "tamagui";

interface InputProps {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void | undefined;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: "text" | "number" | "area";
  formatMoney?: boolean;
  min?: number;
  max?: number;
  numberOfLines?: number;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  inputStyles?: StyleProp<ViewStyle>;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
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
  icon,
  disabled = false,
  inputStyles,
  onBlur,
}) => {
  const theme = useTamaguiTheme();
  const styles = createStyles(theme);

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

      onChangeText?.(numericValue);
    } else if (formatMoney) {
      onChangeText?.(formatCurrency(text));
    } else {
      onChangeText?.(text);
    }
  };

  return (
    <View className="bg-white rounded-xl shadow-sm">
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.requiredText}> *</Text>}
        </Text>
      )}
      <View
        className={`flex flex-row items-center content-center justify-center
           bg-gray-50 rounded-lg px-3 py-2 border 
           ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
      >
        {icon && (
          <Ionicons name={icon} size={18} color="#6B7280" className="mr-3" />
        )}
        <TextInput
          className={`flex-1 ${type === "area" ? "h-20" : ""}`}
          value={value}
          style={[styles.input, inputStyles]}
          onChangeText={handleChangeText}
          placeholder={placeholder ?? `Nhập ${label}...`}
          keyboardType={type === "number" ? "numeric" : keyboardType}
          placeholderTextColor="#9CA3AF"
          multiline={type === "area"}
          numberOfLines={type === "area" ? numberOfLines : 1}
          editable={!disabled}
          onBlur={(e) => onBlur?.(e)}
        />
      </View>
      {error && (
        <Text className="mt-1" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
