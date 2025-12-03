import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data
const mockRentals = [
  {
    id: "1",
    roomNumber: "101",
    tenantName: "Nguyễn Văn A",
    startDate: "01/01/2024",
    endDate: "01/01/2025",
    status: "active",
    monthlyRent: "3.500.000",
  },
  {
    id: "2",
    roomNumber: "102",
    tenantName: "Trần Thị B",
    startDate: "15/01/2024",
    endDate: "15/01/2025",
    status: "active",
    monthlyRent: "3.200.000",
  },
];

const RentalListScreen = ({ navigation }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "expired":
        return "#F44336";
      case "pending":
        return "#FFC107";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang thuê";
      case "expired":
        return "Hết hạn";
      case "pending":
        return "Chờ duyệt";
      default:
        return status;
    }
  };

  const renderRentalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rentalCard}
      onPress={() => navigation.navigate("RentalDetail", { rentalId: item.id })}
    >
      <View style={styles.rentalHeader}>
        <Text style={styles.roomNumber}>Phòng {item.roomNumber}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.rentalInfo}>
        <Text style={styles.tenantName}>{item.tenantName}</Text>
        <Text style={styles.rentalPeriod}>
          {item.startDate} - {item.endDate}
        </Text>
        <Text style={styles.monthlyRent}>{item.monthlyRent}đ/tháng</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách hợp đồng</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddRental")}
        >
          <Text style={styles.addButtonText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockRentals}
        renderItem={renderRentalItem}
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
  rentalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rentalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  rentalInfo: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  tenantName: {
    fontSize: 16,
    marginBottom: 4,
  },
  rentalPeriod: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  monthlyRent: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
});

export default RentalListScreen;
