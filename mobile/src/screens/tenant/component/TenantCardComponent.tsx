import CardComponent from "@/screens/common/CardComponent";
import { colors } from "@/theme/colors";
import { PropertyListResponse } from "@/types/property";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TenantCardComponent = (props: {
  tenantInfo: PropertyListResponse;
  status: { label: string; color: string; bg: string };
  onUpdate: () => void;
}) => {
  const { tenantInfo, status, onUpdate } = props;

  return (
    <CardComponent>
      <View>
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <View
              className="flex-row justify-between items-center"
              style={styles.titleRow}
            >
              <Text style={styles.buildingName}>{tenantInfo.name}</Text>
              <View
                style={[styles.statusBadge, { backgroundColor: status.bg }]}
              >
                <Text style={[styles.statusText, { color: status.color }]}>
                  {status.label}
                </Text>
              </View>
            </View>
            <Text style={styles.buildingAddress}>{tenantInfo.address}</Text>
          </View>
          <TouchableOpacity style={styles.updateBtn} onPress={onUpdate}>
            <Ionicons name="pencil" size={18} color={colors.primary.main} />
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.buildingDesc}>{tenantInfo.description}</Text> */}

        <View style={styles.basicInfoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🏢</Text>
            <Text style={styles.infoLabel}>{tenantInfo.numberFloor} tầng</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🔑</Text>
            <Text style={styles.infoLabel}>{tenantInfo.totalRoom} phòng</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>👤</Text>
            <Text style={styles.infoLabel}>{tenantInfo.renterNumber} thuê</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.status.success + "10",
                borderColor: colors.status.success + "30",
              },
            ]}
            // onPress={() =>
            //   navigation.navigate("AddRoom", { buildingId: item.id })
            // }
          >
            <Ionicons name="add" size={16} color={colors.status.success} />
            <Text
              style={[styles.actionBtnText, { color: colors.status.success }]}
            >
              Thêm phòng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.primary.light,
                borderColor: colors.primary.main + "30",
              },
            ]}
            // onPress={() =>
            //   navigation.navigate("RoomList", { buildingId: item.id })
            // }
          >
            <Ionicons name="home" size={16} color={colors.primary.main} />
            <Text
              style={[styles.actionBtnText, { color: colors.primary.main }]}
            >
              Xem phòng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buildingName: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  buildingAddress: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  updateBtn: {
    backgroundColor: colors.background.paper,
    borderRadius: 8,
    padding: 7,
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buildingDesc: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 6,
    fontStyle: "italic",
  },
  basicInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
