import { colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background?.default || "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.neutral?.black || "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border?.light || "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text?.primary || "#1F2937",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionItem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginLeft: 4,
  },
  viewButton: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  renewButton: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  terminateButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  editButton: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  body: {
    // body có thể tuỳ chỉnh thêm nếu cần
  },
  footer: {
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    // marginLeft: 8,
    alignSelf: "center",
    position: "absolute",
    right: -80,
    top: -35,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default styles;
