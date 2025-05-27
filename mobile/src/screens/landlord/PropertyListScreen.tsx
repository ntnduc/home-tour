import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data
const mockProperties = [
  {
    id: "1",
    title: "Phòng trọ cao cấp",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    totalRooms: 10,
    availableRooms: 3,
    images: ["https://example.com/room1.jpg"],
  },
  {
    id: "2",
    title: "Phòng trọ tiện nghi",
    address: "456 Lê Văn Việt, Quận 9, TP.HCM",
    totalRooms: 8,
    availableRooms: 2,
    images: ["https://example.com/room2.jpg"],
  },
];

const PropertyListScreen = ({ navigation }) => {
  const renderPropertyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() =>
        navigation.navigate("PropertyDetail", { propertyId: item.id })
      }
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.propertyImage}
        defaultSource={require("../../../assets/placeholder.png")}
      />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle}>{item.title}</Text>
        <Text style={styles.propertyAddress}>{item.address}</Text>
        <View style={styles.roomStats}>
          <Text style={styles.roomStatsText}>
            Tổng số phòng: {item.totalRooms}
          </Text>
          <Text style={styles.roomStatsText}>
            Phòng trống: {item.availableRooms}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách phòng trọ</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddProperty")}
        >
          <Text style={styles.addButtonText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockProperties}
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
  },
  propertyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  propertyAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  roomStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roomStatsText: {
    fontSize: 14,
    color: "#333",
  },
});

export default PropertyListScreen;
