import { createStyles } from "@/styles/component/StyleComboBox";
import { ComboOption } from "@/types/comboOption";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme as useTamaguiTheme } from "tamagui";

interface ComboBoxProps<T> {
  value: T;
  options: ComboOption<T, string>[];
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  isLoading?: boolean;
  onFocus?: () => void;
  isActive?: boolean;
  label?: string;
  required?: boolean;
}

export const ComboBox = <T,>({
  value,
  options,
  onChange,
  placeholder = "Chọn...",
  error,
  isLoading = false,
  onFocus,
  isActive = false,
  label,
  required = false,
}: ComboBoxProps<T>) => {
  const theme = useTamaguiTheme();
  const styles = createStyles(theme);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!isActive) {
      setShowDropdown(false);
    }
  }, [isActive]);

  const selectedOption = options.find((option) => option.key === value);

  const handleSelect = (key: T) => {
    onChange(key);
    setShowDropdown(false);
    setSearchText("");
  };

  const handleToggleDropdown = () => {
    if (!showDropdown && onFocus) {
      onFocus();
    }
    setShowDropdown(!showDropdown);
  };

  const filteredOptions = options.filter((option) =>
    option.label?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.skeletonText} />
        <View style={styles.skeletonIcon} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={{ color: "red" }}>*</Text>}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.selectInput, error && styles.errorInput]}
        onPress={handleToggleDropdown}
      >
        <Text style={[styles.selectText, error && styles.errorText]}>
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={error ? "#ff3b30" : "#666"}
        />
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownContainer}>
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
              onChangeText={setSearchText}
            />
          </View>
          <ScrollView style={{ maxHeight: 250 }}>
            {filteredOptions.map((option) => (
              <TouchableOpacity
                key={String(option.key)}
                style={[
                  styles.item,
                  value === option.key && styles.itemSelected,
                ]}
                onPress={() => handleSelect(option.key)}
              >
                <Text
                  style={[
                    styles.itemText,
                    value === option.key && styles.itemTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            {filteredOptions.length === 0 && (
              <Text style={styles.noResults}>Không tìm thấy kết quả</Text>
            )}
          </ScrollView>
        </View>
      )}
      {error && (
        <Text className="mt-1" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};
