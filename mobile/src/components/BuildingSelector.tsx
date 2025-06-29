import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Building {
  id: string;
  name: string;
  address: string;
  roomCount: number;
}

interface BuildingSelectorProps {
  buildings: Building[];
  selectedBuilding: string | null;
  onSelectBuilding: (buildingId: string | null) => void;
}

const BuildingSelector = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
}: BuildingSelectorProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedBuildingData = selectedBuilding
    ? buildings.find((b) => b.id === selectedBuilding)
    : null;

  const handleSelectBuilding = (buildingId: string | null) => {
    onSelectBuilding(buildingId);
    setIsModalVisible(false);
  };

  const renderBuildingItem = ({ item }: { item: Building }) => (
    <TouchableOpacity
      style={[
        styles.buildingItem,
        selectedBuilding === item.id && styles.selectedBuildingItem,
      ]}
      onPress={() => handleSelectBuilding(item.id)}
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
          {item.address}
        </Text>
        <Text
          style={[
            styles.roomCount,
            selectedBuilding === item.id && styles.selectedRoomCount,
          ]}
        >
          {item.roomCount} phòng
        </Text>
      </View>
      {selectedBuilding === item.id && (
        <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="mx-2">
      <TouchableOpacity
        className="mb-2"
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
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

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn tòa nhà</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={[
                {
                  id: null,
                  name: "Tất cả tòa nhà",
                  address: "",
                  roomCount: buildings.reduce((sum, b) => sum + b.roomCount, 0),
                },
                ...buildings,
              ]}
              renderItem={({ item }) =>
                item.id === null ? (
                  <TouchableOpacity
                    style={[
                      styles.buildingItem,
                      selectedBuilding === null && styles.selectedBuildingItem,
                    ]}
                    onPress={() => handleSelectBuilding(null)}
                  >
                    <View style={styles.buildingInfo}>
                      <Text
                        style={[
                          styles.buildingName,
                          selectedBuilding === null &&
                            styles.selectedBuildingName,
                        ]}
                      >
                        Tất cả tòa nhà
                      </Text>
                      <Text
                        style={[
                          styles.roomCount,
                          selectedBuilding === null && styles.selectedRoomCount,
                        ]}
                      >
                        {item.roomCount} phòng
                      </Text>
                    </View>
                    {selectedBuilding === null && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#007AFF"
                      />
                    )}
                  </TouchableOpacity>
                ) : (
                  renderBuildingItem({ item: item as Building })
                )
              }
              keyExtractor={(item) => item.id || "all"}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalList}
            />
          </View>
        </View>
      </Modal>
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
