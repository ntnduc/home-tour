import ButtonAction from "@/components/ButtomAction";
import { StatusType } from "@/components/Status";
import CardComponent from "@/screens/common/CardComponent";
import { theme } from "@/theme";
import { colors } from "@/theme/colors";
import { PropertyListResponse, PropertyRoomsStatus } from "@/types/property";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TenantCardComponent = (props: {
  tenantInfo: PropertyListResponse;
  onUpdate: (id: string) => void;
}) => {
  const { tenantInfo, onUpdate } = props;

  const getStatusInfo = (
    status?: PropertyRoomsStatus
  ): { label: string; key: StatusType } => {
    switch (status) {
      case PropertyRoomsStatus.FULL:
        return {
          label: "Đầy phòng",
          key: "success",
        };
      case PropertyRoomsStatus.EMPTY:
        return {
          label: "Chưa tạo phòng",
          key: "error",
        };
      case PropertyRoomsStatus.PARTIAL:
        return {
          label: "Còn phòng",
          key: "warning",
        };
      default:
        return {
          label: "Trống",
          key: "warning",
        };
    }
  };

  const status = getStatusInfo(tenantInfo.statusRooms);

  return (
    <CardComponent
      className="mt-3"
      title={tenantInfo.name}
      actions={["edit", "delete"]}
      onActionPress={(key) => {
        if (key === "edit") onUpdate(tenantInfo.id);
      }}
      classNameBadge="absolute right-[-80] top-[-35] "
      statusBadge={{ ...status }}
    >
      <View className="flex flex-col ">
        <View>
          <Text style={styles.buildingAddress}>{tenantInfo.address}</Text>
        </View>

        <View style={styles.basicInfoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🏢</Text>
            <Text style={styles.infoLabel}>
              {tenantInfo.numberFloor ?? 0} tầng
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🔑</Text>
            <Text style={styles.infoLabel}>{tenantInfo.totalRoom} phòng</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>👤</Text>
            <Text style={styles.infoLabel}>
              {tenantInfo.totalRoomOccupied ?? 0} thuê
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <ButtonAction
            text="Thêm phòng"
            type="success"
            icon="add"
            containerStyle={{ flex: 1 }}
            // onPress={() => {
            //   navigation.navigate("AddRoom", { buildingId: tenantInfo.id });
            // }}
          />
          <ButtonAction
            text="Xem phòng"
            type="secondary"
            icon="home"
            containerStyle={{ flex: 1 }}
          />
        </View>
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  buildingName: {
    fontSize: theme.typography.fontSize.lg + 2,
    fontWeight: "bold",
    color: colors.text.primary,
  },

  buildingAddress: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  updateBtn: {
    backgroundColor: colors.background.paper,
    borderRadius: 8,
    padding: 7,
    marginLeft: 6,
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
  },
  infoIcon: {
    fontSize: 13,
    color: colors.text.secondary,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },

  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default TenantCardComponent;
