import { createStyles } from "@/styles/component/StyleComboBox";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTheme as useTamaguiTheme } from "tamagui";
import { InputIconProps } from "./Input";

interface ComboBoxProps<T> {
  value?: T | string | null | undefined | number;
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
  onSearch?: (text: string) => void;
  nestedScrollEnabled?: boolean;
  scrollEnabled?: boolean;
  renderItem?: (item: T, selected?: boolean) => React.ReactElement | null;
  icon?:
    | React.ReactElement
    | keyof typeof Ionicons.glyphMap
    | ((
        value: T | string | null | undefined | number,
        options: T[],
        visible?: boolean
      ) => React.ReactElement | null)
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
  onSearch,
  icon,
  iconProps,
  renderItem,
}: ComboBoxProps<T>) => {
  const theme = useTamaguiTheme();
  const styles = createStyles(theme);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!isActive) {
      setOpen(false);
    }
  }, [isActive]);

  const handleSelect = (key: T) => {
    onChange(key);
    setOpen(false);
    setSearchText("");
  };

  const _renderLoading = useCallback(() => {
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
  }, [isLoading]);

  const _renderSearch = useCallback(
    (onSearch: (text: string) => void) => {
      return (
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={onSearch}
          />
        </View>
      );
    },
    [searchText, value, options]
  );

  const _renderLeftIcons = useCallback(
    (visible?: boolean): React.ReactElement | null => {
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
    },
    [icon, value, options, iconProps, disabled, isLoading]
  );

  const _renderRightIcons = useCallback(
    (visible?: boolean) => {
      if (disabled) return null;
      if (visible) {
        return (
          <Ionicons
            name="chevron-up"
            size={18}
            color={"#6B7280"}
            className="mr-3 "
          />
        );
      }
      return (
        <Ionicons
          name="chevron-down"
          size={18}
          color={"#6B7280"}
          className="mr-3 "
        />
      );
    },
    [open, disabled]
  );

  const _renderEmpty = useCallback(() => {
    return <Text style={styles.noResults}>Không tìm thấy kết quả</Text>;
  }, [value, options, disabled, isLoading]);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={{ color: "red" }}>*</Text>}
        </Text>
      )}

      {isLoading ? (
        _renderLoading()
      ) : (
        <>
          <Dropdown
            value={value as any}
            data={options}
            onChange={(callback) => {
              if (typeof callback === "function") {
                const newValue = callback(value, options);
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
              { borderWidth: 1, borderColor: error ? "#ff3b30" : "#e5e7eb" },
              disabled ? { backgroundColor: "#f3f4f6" } : {},
            ]}
            autoScroll={true}
            containerStyle={styles.dropdownContainer}
            search={isSearch}
            selectedTextStyle={styles.itemTextSelected}
            itemTextStyle={styles.itemText}
            keyboardAvoiding={true}
            renderLeftIcon={_renderLeftIcons}
            renderInputSearch={_renderSearch}
            renderRightIcon={_renderRightIcons}
            renderItem={renderItem}
            onChangeText={(text) => {
              onSearch?.(text);
              setSearchText(text);
            }}
            flatListProps={{
              ListEmptyComponent: _renderEmpty,
            }}
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
        </>
      )}
    </View>
  );
};
