import { ComboOptionWithExtra } from "@/types/comboOption";
import { PropertyDetail } from "@/types/property";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  buildings: ComboOptionWithExtra<string | null, string, PropertyDetail>[];
  selectedBuilding?: string | null;
  onSelectedBuiling?: (
    buildingId: string | null,
    building?: PropertyDetail
  ) => void;
};

const BuildingFilterComponent = ({
  buildings,
  selectedBuilding,
  onSelectedBuiling,
}: Props) => {
  const renderBuildingItem = ({
    item,
    index,
  }: {
    item: ComboOptionWithExtra<string, string, PropertyDetail>;
    index: number;
  }) => {
    if (!item.value)
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.buildingItem,
            selectedBuilding === item.value && styles.selectedBuildingItem,
          ]}
          onPress={() => {
            onSelectedBuiling && onSelectedBuiling(null);
          }}
        >
          <View style={styles.buildingInfo}>
            <Text
              style={[
                styles.buildingName,
                selectedBuilding === item.value && styles.selectedBuildingName,
              ]}
            >
              {item.label}
            </Text>
          </View>
          {selectedBuilding === item.value && (
            <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          )}
        </TouchableOpacity>
      );

    const extraData = item.extra;
    if (!extraData)
      return (
        <View>
          <Text>Không có dữ liệu!</Text>
        </View>
      );

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.buildingItem,
          selectedBuilding === item.value && styles.selectedBuildingItem,
        ]}
        onPress={() => {
          onSelectedBuiling && onSelectedBuiling(item.value, extraData);
        }}
      >
        <View style={styles.buildingInfo}>
          <Text
            style={[
              styles.buildingName,
              selectedBuilding === item.value && styles.selectedBuildingName,
            ]}
          >
            {extraData?.name}
          </Text>
          <Text
            style={[
              styles.buildingAddress,
              selectedBuilding === item.value && styles.selectedBuildingAddress,
            ]}
          >
            {extraData?.address}
          </Text>
        </View>
        {selectedBuilding === item.value && (
          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
  };

  const data = [
    {
      value: null,
      label: "Tất cả tòa nhà",
      extra: null,
    },
    ...buildings,
  ];

  return (
    <View className="h-full ">
      {data.map((item: any, index) => renderBuildingItem({ item, index }))}
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectorText: {
    marginLeft: 6,
    flex: 1,
  },
  selectorLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 1,
  },
  selectorValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  closeButton: {
    padding: 4,
  },

  buildingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedBuildingItem: {
    backgroundColor: "#F0F4FF",
  },
  buildingInfo: {
    flex: 1,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  selectedBuildingName: {
    color: "#007AFF",
  },
  buildingAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  selectedBuildingAddress: {
    color: "#007AFF",
  },
  roomCount: {
    fontSize: 12,
    color: "#888",
  },
  selectedRoomCount: {
    color: "#007AFF",
  },
});

export default BuildingFilterComponent;
