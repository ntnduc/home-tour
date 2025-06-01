import { StyleSheet } from "react-native";

export const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      position: "relative",
    },
    selectInput: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: theme.borderColor?.val,
      borderRadius: 8,
      padding: 12,
      backgroundColor: theme.background?.val,
    },
    selectText: {
      fontSize: 16,
      color: theme.color?.val,
    },
    errorInput: {
      borderColor: theme.red10?.val ?? "#ff3b30",
    },
    errorText: {
      color: theme.red10?.val ?? "#ff3b30",
    },
    dropdownContainer: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "#fff",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      marginTop: 4,
      maxHeight: 300,
      zIndex: 1000,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
    },
    item: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    itemText: {
      fontSize: 16,
      color: "#333",
    },
    itemSelected: {
      backgroundColor: "#f8f9fa",
    },
    itemTextSelected: {
      color: "#6a5af9",
      fontWeight: "600",
    },
    noResults: {
      padding: 16,
      textAlign: "center",
      color: "#666",
      fontSize: 14,
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "#e0e0e0",
      borderRadius: 8,
      padding: 12,
      backgroundColor: "#f5f5f5",
    },
    skeletonText: {
      height: 20,
      width: "70%",
      backgroundColor: "#e0e0e0",
      borderRadius: 4,
    },
    skeletonIcon: {
      width: 20,
      height: 20,
      backgroundColor: "#e0e0e0",
      borderRadius: 4,
    },
  });
