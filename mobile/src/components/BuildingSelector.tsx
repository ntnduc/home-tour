import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface Building {
  id: string;
  name: string;
  address: string;
  roomCount: number;
}

export interface BuildingSelectorProps {
  buildings: Building[];
  selectedBuilding: string | null;
  onSelectBuilding: (buildingId: string | null) => void;
  onOpen?: (buildings: any, selectedBuildingData: any) => void;
}

const BuildingSelector = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  onOpen,
}: BuildingSelectorProps) => {
  const selectedBuildingData = selectedBuilding
    ? buildings.find((b) => b.id === selectedBuilding)
    : null;

  return (
    <View className="mx-2">
      <TouchableOpacity
        className="mb-2"
        style={styles.selector}
        onPress={() => onOpen && onOpen(buildings, selectedBuildingData)}
      >
        <View style={styles.selectorContent}>
          <Ionicons name="business-outline" size={16} color="#007AFF" />
          <View style={styles.selectorText}>
            <Text style={styles.selectorLabel}>Tòa nhà</Text>
            <Text style={styles.selectorValue}>
              {selectedBuildingData
                ? selectedBuildingData.name
                : "Tất cả tòa nhà"}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>
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
  modalList: {
    paddingBottom: 20,
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

export default BuildingSelector;
