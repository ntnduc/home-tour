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

export type SearchConfig = {
  placeholder: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  onSearch: (text: string) => void;
};

export type HeaderComponentsProps = {
  title: string;
  isSearch?: boolean;
  searchConfig?: SearchConfig;
  children?: React.ReactNode;
};

const HeaderComponents = (props: HeaderComponentsProps) => {
  const { title, isSearch, searchConfig, children } = props;
  const [search, setSearch] = useState("");

  const handeleSearch = (text?: string) => {
    if (isSearch && searchConfig) {
      setSearch(text || "");
      searchConfig.onSearch?.(text || "");
    }
  };

  return (
    <View className="flex flex-col justify-between items-center content-center bg-white w-full mb-4">
      <Text style={styles.headerTitle}>{title}</Text>
      {isSearch && (
        <View style={styles.searchBarWrapper}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={{ marginLeft: 10 }}
          />
          <TextInput
            style={[styles.searchBar, searchConfig?.style]}
            placeholder={searchConfig?.placeholder || "Tìm kiếm..."}
            value={search}
            onChangeText={handeleSearch}
            placeholderTextColor="#aaa"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => handeleSearch("")}
              style={{ padding: 6 }}
            >
              <Ionicons name="close-circle" size={18} color="#bbb" />
            </TouchableOpacity>
          )}
        </View>
      )}
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
    marginBottom: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 14,
    textAlign: "center",
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
