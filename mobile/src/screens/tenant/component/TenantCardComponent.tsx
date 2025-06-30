import ButtonAction from "@/components/ButtomAction";
import Status, { StatusType } from "@/components/Status";
import CardComponent from "@/screens/common/CardComponent";
import { theme } from "@/theme";
import { colors } from "@/theme/colors";
import { PropertyListResponse, PropertyRoomsStatus } from "@/types/property";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TenantCardComponent = (props: {
  tenantInfo: PropertyListResponse;
  onUpdate: () => void;
}) => {
  const { tenantInfo, onUpdate } = props;

  const getStatusInfo = (
    status?: PropertyRoomsStatus
  ): { label: string; type: StatusType } => {
    switch (status) {
      case PropertyRoomsStatus.FULL:
        return {
          label: "Đầy phòng",
          type: "success",
        };
      case PropertyRoomsStatus.EMPTY:
        return {
          label: "Chưa tạo phòng",
          type: "error",
        };
      case PropertyRoomsStatus.PARTIAL:
        return {
          label: "Còn phòng",
          type: "warning",
        };
      default:
        return {
          label: "Trống",
          type: "warning",
        };
    }
  };

  const status = getStatusInfo(tenantInfo.statusRooms);

  return (
    <CardComponent>
      <View className="flex flex-col gap-2">
        <View className="flex-row justify-between items-center align-center content-center">
          <View className="flex-1 flex flex-row ">
            <Text style={styles.buildingName}>{tenantInfo.name}</Text>
          </View>
          <View>
            <Status type={status.type} label={status.label} />
          </View>
          <TouchableOpacity style={styles.updateBtn} onPress={onUpdate}>
            <Ionicons name="pencil" size={18} color={colors.primary.main} />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.buildingAddress}>{tenantInfo.address}</Text>
        </View>

        {/* <Text style={styles.buildingDesc}>{tenantInfo.description}</Text> */}

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
