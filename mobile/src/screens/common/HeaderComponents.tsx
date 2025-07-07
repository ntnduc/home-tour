import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useDebouncedCallback } from "use-debounce";

export type SearchConfig = {
  placeholder: string;
  className?: string;
  defaultValue?: string;
  style?: StyleProp<ViewStyle>;
  onSearch: (text: string) => void;
};

export type HeaderComponentsProps = {
  title: string;
  className?: string;
  isSearch?: boolean;
  searchConfig?: SearchConfig;
  children?: React.ReactNode;
  icon?: React.ReactNode;
};

const HeaderComponents = (props: HeaderComponentsProps) => {
  const { title, isSearch, searchConfig, children, className, icon } = props;
  const [search, setSearch] = useState(searchConfig?.defaultValue || "");
  const handleSearch = useDebouncedCallback(() => {
    searchConfig?.onSearch?.(search);
  }, 500);

  const handeleSearchFunc = (text?: string) => {
    if (isSearch && searchConfig) {
      setSearch(text ?? "");
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    handleSearch();
  };

  return (
    <View
      className={`flex flex-col justify-between items-center content-center bg-white w-full ${className}`}
    >
      <View className="flex flex-col justify-between items-center content-center bg-white w-full">
        <View
          className="flex flex-row items-center content-start align-start"
          style={{ alignSelf: "flex-start", marginLeft: 6 }}
        >
          {icon}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        {isSearch && (
          <View
            style={styles.searchBarWrapper}
            className={searchConfig?.className}
          >
            <Ionicons
              name="search"
              size={20}
              color="#888"
              style={{ marginLeft: 10 }}
            />
            <TextInput
              style={[styles.searchBar, searchConfig?.style]}
              placeholder={searchConfig?.placeholder || "Tìm kiếm..."}
              value={searchConfig?.defaultValue || search}
              onChangeText={handeleSearchFunc}
              placeholderTextColor="#aaa"
            />
            {search && (
              <TouchableOpacity
                style={{ padding: 6 }}
                onPress={handleClearSearch}
                disabled={!search}
              >
                <Ionicons name="close-circle" size={18} color="#bbb" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FB",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchBar: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: "#222",
    backgroundColor: "transparent",
  },
  statsLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  statsValue: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    // alignSelf: "flex-start",
    margin: 10,
    letterSpacing: 0.2,
  },
  statsBox: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#F4F6FB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  statsIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
});

export default HeaderComponents;
