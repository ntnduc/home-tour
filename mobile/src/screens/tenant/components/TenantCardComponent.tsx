import { TenantListResponse } from "@/api/tenant/tenant.api";
import ButtonAction from "@/components/ButtomAction";
import { StatusType } from "@/components/Status";
import CardComponent from "@/screens/common/CardComponent";
import { colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TenantCardComponentProps {
  tenant: TenantListResponse;
  onPress: () => void;
  onUpdate: () => void;
}

const TenantCardComponent = ({
  tenant,
  onPress,
  onUpdate,
}: TenantCardComponentProps) => {
  const getStatusInfo = (
    status: "active" | "expired" | "pending"
  ): { label: string; key: StatusType } => {
    switch (status) {
      case "active":
        return {
          label: "Đang thuê",
          key: "success",
        };
      case "expired":
        return {
          label: "Hết hạn",
          key: "error",
        };
      case "pending":
        return {
          label: "Chờ xử lý",
          key: "warning",
        };
      default:
        return {
          label: "Không xác định",
          key: "warning",
        };
    }
  };

  const status = getStatusInfo(tenant.contractStatus);

  return (
    <CardComponent
      className="mt-3"
      title={tenant.name}
      actions={["edit", "delete"]}
      onActionPress={(key) => {
        if (key === "edit") onUpdate();
      }}
      classNameBadge="absolute right-[-80] top-[-35]"
      statusBadge={{ ...status }}
      onPress={onPress}
    >
      <View className="flex flex-col">
        <View className="mb-2">
          <Text style={styles.tenantEmail}>{tenant.email}</Text>
          <Text style={styles.tenantPhone}>{tenant.phone}</Text>
        </View>

        {tenant.roomName && (
          <View className="mb-3">
            <Text style={styles.roomInfo}>
              📍 {tenant.propertyName} - {tenant.roomName}
            </Text>
          </View>
        )}

        <View style={styles.basicInfoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💰</Text>
            <Text style={styles.infoLabel}>
              {tenant.rentAmount.toLocaleString()} VNĐ
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🛡️</Text>
            <Text style={styles.infoLabel}>
              {tenant.depositAmount.toLocaleString()} VNĐ
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoLabel}>
              {new Date(tenant.startDate).toLocaleDateString("vi-VN")}
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <ButtonAction
            text="Xem hợp đồng"
            type="secondary"
            icon="document-text"
            containerStyle={{ flex: 1 }}
            onPress={() => {
              // TODO: Navigate to contract detail
            }}
          />
          <ButtonAction
            text="Tạo hóa đơn"
            type="success"
            icon="receipt"
            containerStyle={{ flex: 1 }}
            onPress={() => {
              // TODO: Navigate to create invoice
            }}
          />
        </View>
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  tenantEmail: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  tenantPhone: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  roomInfo: {
    fontSize: 13,
    color: colors.primary.main,
    fontWeight: "500",
  },
  basicInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
});

export default TenantCardComponent;
