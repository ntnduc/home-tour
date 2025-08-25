import { createStyles } from "@/styles/component/StyleComboBox";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTheme as useTamaguiTheme } from "tamagui";
import { InputIconProps } from "./Input";

interface ComboBoxProps<T> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  isLoading?: boolean;
  onFocus?: () => void;
  isActive?: boolean;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  isSearch?: boolean;
  nestedScrollEnabled?: boolean;
  scrollEnabled?: boolean;
  icon?:
    | React.ReactElement
    | keyof typeof Ionicons.glyphMap
    | ((value: T, options: T[], visible?: boolean) => React.ReactElement | null)
    | keyof typeof Ionicons.glyphMap;
  iconProps?: InputIconProps;
}

export const ComboBox = <T,>({
  value,
  options,
  onChange,
  placeholder = "Chọn...",
  error,
  isLoading = false,
  isActive = false,
  label,
  required = false,
  isSearch = true,
  disabled = false,
  icon,
  iconProps,
}: ComboBoxProps<T>) => {
  const theme = useTamaguiTheme();
  const styles = createStyles(theme);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setOpen(false);
    }
  }, [isActive]);

  const handleSelect = (key: T) => {
    onChange(key);
    setOpen(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View
          style={{
            padding: 12,
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            minHeight: 48,
          }}
        >
          <View
            style={{
              height: 20,
              width: "70%",
              backgroundColor: "#e0e0e0",
              borderRadius: 4,
            }}
          />
        </View>
      </View>
    );
  }

  const _renderIcons = (visible?: boolean): React.ReactElement | null => {
    if (!icon) return null;
    if (typeof icon === "string") {
      return (
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color={"#6B7280"}
          className="mr-3 ml-[-1px]"
          {...iconProps}
        />
      );
    }
    if (typeof icon === "function") {
      const _renderIconType = icon(value, options, visible);
      if (typeof _renderIconType === "string") {
        return (
          <Ionicons
            name={_renderIconType as keyof typeof Ionicons.glyphMap}
            size={18}
            color={"#6B7280"}
            className="mr-3 ml-[-1px]"
            {...iconProps}
          />
        );
      }

      return _renderIconType as React.ReactElement;
    }
    return React.cloneElement(
      icon as React.ReactElement,
      {
        size: 18,
        color: "#6B7280",
        className: "mr-3 ml-[-1px]",
        ...iconProps,
      } as any
    );
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={{ color: "red" }}>*</Text>}
        </Text>
      )}

      <Dropdown
        value={value as any}
        data={options}
        onChange={(callback) => {
          if (typeof callback === "function") {
            const newValue = callback(value as any);
            if (newValue !== undefined && newValue !== null) {
              handleSelect(newValue);
            }
          } else {
            handleSelect(callback as T);
          }
        }}
        placeholder={placeholder}
        style={[
          styles.selectInput,
          error && styles.errorInput,
          { borderWidth: 1, borderColor: error ? "#ff3b30" : "#e0e0e0" },
        ]}
        autoScroll={true}
        containerStyle={styles.dropdownContainer}
        search={isSearch}
        selectedTextStyle={styles.itemTextSelected}
        itemTextStyle={styles.itemText}
        iconStyle={styles.iconRight}
        renderLeftIcon={_renderIcons}
        disable={isLoading || disabled}
        placeholderStyle={{ color: "#999" }}
        labelField="label"
        valueField="key"
      />

      {error && (
        <Text className="mt-1" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};
