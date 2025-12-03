import type { CardActionConfig } from "@/screens/common/CardComponent";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export const ViewDetailAction = (onPress: () => void): CardActionConfig => ({
  key: "view",
  icon: <Ionicons name="eye-outline" size={16} color="#007AFF" />,
  label: "Xem",
  onPress,
});

export const RenewAction = (onPress: () => void): CardActionConfig => ({
  key: "renew",
  icon: <Ionicons name="refresh-outline" size={16} color="#34C759" />,
  label: "Gia hạn",
  onPress,
});

export const TerminateAction = (onPress: () => void): CardActionConfig => ({
  key: "terminate",
  icon: <Ionicons name="close-outline" size={16} color="#FF3B30" />,
  label: "Chấm dứt",
  onPress,
});

export const EditAction = (onPress: () => void): CardActionConfig => ({
  key: "edit",
  icon: <Ionicons name="create-outline" size={16} color="#FFA500" />,
  label: "Sửa",
  onPress,
});

export const DeleteAction = (onPress: () => void): CardActionConfig => ({
  key: "delete",
  icon: <Ionicons name="trash-outline" size={16} color="#FF3B30" />,
  label: "Xoá",
  onPress,
});

export const CARD_ACTION_PRESETS: Record<
  string,
  (onPress: () => void) => CardActionConfig
> = {
  view: ViewDetailAction,
  renew: RenewAction,
  terminate: TerminateAction,
  edit: EditAction,
  delete: DeleteAction,
};
