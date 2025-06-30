import { StyleSheet } from "react-native";

export const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
    },
    input: {
      lineHeight: theme?.input?.lineHeight ?? 20,
      fontSize: theme?.input?.fontSize ?? 16,
      paddingVertical: theme?.input?.paddingVertical ?? 4,
    },
    inputError: {
      borderColor: "#ff3b30",
    },
    errorText: {
      color: theme.red10?.val ?? "#ff3b30",
    },
    label: {
      fontSize: theme?.input?.label?.fontSize ?? 16,
      fontWeight: theme?.input?.label?.fontWeight ?? "600",
      marginBottom: theme?.input?.label?.marginBottom ?? 8,
      color: theme.color?.val,
    },
    requiredText: {
      color: "#ff3b30",
    },
  });
