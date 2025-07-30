import { Building, BuildingSelectorProps } from "@/components/BuildingSelector";
import { ComboOptionWithExtra } from "@/types/comboOption";
import { PropertyDetail } from "@/types/property";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  buildings: ComboOptionWithExtra<string, string, PropertyDetail>[];
  selectedBuilding?: string;
  onSelectedBuiling?: (buildingId: string, building: PropertyDetail) => void;
};

const BuildingFilterComponent = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
}: BuildingSelectorProps) => {
  const renderBuildingItem = ({
    item,
    index,
  }: {
    item: Building;
    index: number;
  }) => {
    if (!item.id)
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.buildingItem,
            selectedBuilding === item.id && styles.selectedBuildingItem,
          ]}
          onPress={() => {
            //TODO: handle selected room
          }}
        >
          <View style={styles.buildingInfo}>
            <Text
              style={[
                styles.buildingName,
                selectedBuilding === item.id && styles.selectedBuildingName,
              ]}
            >
              {item.name}
            </Text>
          </View>
          {selectedBuilding === item.id && (
            <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          )}
        </TouchableOpacity>
      );

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.buildingItem,
          selectedBuilding === item.id && styles.selectedBuildingItem,
        ]}
        onPress={() => {
          //TODO: handle selected room
        }}
      >
        <View style={styles.buildingInfo}>
          <Text
            style={[
              styles.buildingName,
              selectedBuilding === item.id && styles.selectedBuildingName,
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.buildingAddress,
              selectedBuilding === item.id && styles.selectedBuildingAddress,
            ]}
          >
            {item?.address}
          </Text>
        </View>
        {selectedBuilding === item.id && (
          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
  };

  const data = [
    {
      id: null,
      name: "Tất cả tòa nhà",
      address: "",
      roomCount: buildings.reduce((sum, b) => sum + b.roomCount, 0),
    },
    ...buildings,
  ];

  return (
    <View className="h-full ">
      {data.map((item, index) =>
        renderBuildingItem({ item: item as Building, index })
      )}
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
