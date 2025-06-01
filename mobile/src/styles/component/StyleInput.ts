import { StyleSheet } from "react-native";

export const createStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  requiredText: {
    color: "#ff3b30",
  },
});
