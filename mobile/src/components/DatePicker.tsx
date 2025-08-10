import { createStyles } from "@/styles/component/StyleInput";
import { formatDate } from "@/utils/dateUtil";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme as useTamaguiTheme } from "tamagui";
import { useGlobalAppSheet } from "./GlobalAppSheet";

export interface DatePickerIconProps {
  name?: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  className?: string;
}

interface DatePickerProps {
  label?: string;
  value?: Date | null | undefined | string;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  inputStyles?: StyleProp<ViewStyle>;
  icon?: keyof typeof Ionicons.glyphMap;
  iconProps?: DatePickerIconProps;
  onClear?: () => void;
  showClear?: boolean;
  maxDate?: Date;
  minDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Chọn ngày",
  error,
  required = false,
  disabled = false,
  inputStyles,
  icon = "calendar",
  iconProps,
  onClear,
  showClear = true,
  maxDate,
  minDate,
}) => {
  const theme = useTamaguiTheme();
  const { openAppSheet, closeAppSheet } = useGlobalAppSheet();
  const styles = createStyles(theme);

  const handleOpen = () => {
    if (disabled) return;

    openAppSheet(
      <DateTimePicker
        value={value ? new Date(value) : new Date()}
        mode="date"
        locale="vi-VN"
        display="spinner"
        maximumDate={maxDate}
        minimumDate={minDate}
        onChange={(event, date) => {
          if (date) {
            onChange?.(date);
          }
        }}
      />,
      {
        panGestureEnabled: false,
        closeOnOverlayTap: false,
        adjustToContentHeight: false,
        modalHeight: 290,
        modalStyle: {
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "100%",
          width: "100%",
        },
        header: {
          element: (
            <View className="flex-row justify-between items-center border-b border-gray-200 w-full p-4 rounded-t-2xl">
              <TouchableOpacity onPress={closeAppSheet} className="py-2">
                <Text className="text-gray-600 font-medium">Hủy</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-gray-900">
                Chọn ngày
              </Text>
              <TouchableOpacity
                onPress={() => {
                  closeAppSheet();
                }}
                className="px-4 py-2 bg-blue-500 rounded-lg"
              >
                <Text className="text-white font-semibold">Xong</Text>
              </TouchableOpacity>
            </View>
          ),
        },
      }
    );
  };

  const handleClear = () => {
    onChange?.(null);
    onClear?.();
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
           ${error ? "border-red-300 bg-red-50" : "border-gray-200"}
           ${disabled ? "opacity-50" : ""}`}
        style={inputStyles}
      >
        <TouchableOpacity
          className="flex-1"
          onPress={handleOpen}
          disabled={disabled}
        >
          <View className="flex-row items-center">
            {icon && (
              <Ionicons
                name={icon}
                size={18}
                color={"#6B7280"}
                className="mr-3"
                {...iconProps}
              />
            )}
            <Text
              className={`text-base ${
                value ? "text-gray-900" : "text-gray-500"
              }`}
              style={[
                styles.input,
                inputStyles,
                { borderColor: error ? "#ff3b30" : "#ddd" },
              ]}
            >
              {value ? formatDate(value?.toString() ?? "") : placeholder}
            </Text>
          </View>
        </TouchableOpacity>
        {value && showClear && !disabled && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons
              name="close-outline"
              size={18}
              color={"#6B7280"}
              className="mr-3"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="mt-1" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default DatePicker;
