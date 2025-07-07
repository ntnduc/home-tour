import { CARD_ACTION_PRESETS } from "@/components/CardActionsPresets";
import styles from "@/components/CardComponent.styles";
import React from "react";
import {
  GestureResponderEvent,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export type CardActionConfig = {
  key: string;
  icon?: React.ReactNode;
  label?: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: any;
  customButton?: React.ReactNode;
};

const STATUS_BADGE_PRESETS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  success: { label: "Thành công", color: "#22C55E", bg: "#F0FDF4" },
  denied: { label: "Từ chối", color: "#EF4444", bg: "#FEF2F2" },
  warning: { label: "Cảnh báo", color: "#D97706", bg: "#FEF3C7" },
  // Thêm loại mới ở đây nếu muốn
};

export type CardComponentProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
  title?: string;
  actions?: (CardActionConfig | string)[];
  renderActions?: () => React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onActionPress?: (key: string) => void;
  statusBadge?: {
    key: string;
    label?: string;
    color?: string;
    bg?: string;
  };
};

const getStatusBadge = (badge?: {
  key: string;
  label?: string;
  color?: string;
  bg?: string;
}) => {
  if (!badge) return undefined;
  if (badge.key === "custom") {
    return {
      label: badge.label || "",
      color: badge.color || "#000",
      bg: badge.bg || "#fff",
    };
  }
  return { ...STATUS_BADGE_PRESETS[badge.key], ...badge };
};

const CardComponent = (props: CardComponentProps) => {
  const {
    children,
    style,
    className,
    title,
    actions,
    renderActions,
    header,
    footer,
    onActionPress,
    statusBadge,
  } = props;

  // Helper: build action config từ string preset hoặc object
  const buildAction = (
    action: CardActionConfig | string
  ): (CardActionConfig & { presetKey?: string }) | null => {
    if (typeof action === "string") {
      const preset = CARD_ACTION_PRESETS[action];
      if (!preset) return null;
      return {
        ...preset(() => onActionPress && onActionPress(action)),
        presetKey: action,
      };
    }
    return action;
  };

  // Helper: lấy style cho action preset
  const getActionStyle = (presetKey?: string, customStyle?: any) => {
    switch (presetKey) {
      case "view":
        return [styles.actionItem, styles.viewButton, customStyle];
      case "renew":
        return [styles.actionItem, styles.renewButton, customStyle];
      case "terminate":
        return [styles.actionItem, styles.terminateButton, customStyle];
      case "edit":
        return [styles.actionItem, styles.editButton, customStyle];
      case "delete":
        return [styles.actionItem, styles.deleteButton, customStyle];
      default:
        return [styles.actionItem, customStyle];
    }
  };

  const badge = getStatusBadge(statusBadge);

  return (
    <View
      style={[styles.card, style]}
      className={`rounded-xl p-4 mb-4 ${className || ""}`}
    >
      {/* Header */}
      {header !== undefined ? (
        header
      ) : title || actions || renderActions ? (
        <View style={styles.header}>
          {/* Hàng trên: title + status badge */}
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {badge && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: badge.bg, marginLeft: 8 },
                ]}
              >
                <Text style={[styles.statusText, { color: badge.color }]}>
                  {badge.label}
                </Text>
              </View>
            )}
          </View>
          {/* Hàng dưới: action button, căn phải */}
          <View style={{ alignItems: "flex-end", marginTop: 4 }}>
            <View style={styles.actionsContainer}>
              {actions &&
                actions.map((action, idx) => {
                  const act = buildAction(action);
                  if (!act) return null;
                  return act.customButton ? (
                    <View key={act.key} style={styles.actionItem}>
                      {act.customButton}
                    </View>
                  ) : (
                    <TouchableOpacity
                      key={act.key}
                      onPress={act.onPress}
                      style={getActionStyle((act as any).presetKey, act.style)}
                      accessibilityLabel={act.label}
                    >
                      {act.icon}
                    </TouchableOpacity>
                  );
                })}
              {renderActions && renderActions()}
            </View>
          </View>
        </View>
      ) : null}

      {/* Body */}
      <View style={styles.body}>{children}</View>

      {/* Footer */}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
};

export default CardComponent;
