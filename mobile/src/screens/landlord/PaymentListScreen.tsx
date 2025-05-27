import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data
const mockPayments = [
  {
    id: "1",
    roomNumber: "101",
    tenantName: "Nguyễn Văn A",
    amount: "3.500.000",
    date: "01/01/2024",
    status: "paid",
    type: "rent",
  },
  {
    id: "2",
    roomNumber: "102",
    tenantName: "Trần Thị B",
    amount: "3.200.000",
    date: "15/01/2024",
    status: "pending",
    type: "rent",
  },
];

const PaymentListScreen = ({ navigation }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "#4CAF50";
      case "pending":
        return "#FFC107";
      case "overdue":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "overdue":
        return "Quá hạn";
      default:
        return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "rent":
        return "Tiền thuê";
      case "deposit":
        return "Tiền cọc";
      case "utility":
        return "Tiện ích";
      default:
        return type;
    }
  };

  const renderPaymentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.paymentCard}
      onPress={() =>
        navigation.navigate("PaymentDetail", { paymentId: item.id })
      }
    >
      <View style={styles.paymentHeader}>
        <View>
          <Text style={styles.roomNumber}>Phòng {item.roomNumber}</Text>
          <Text style={styles.tenantName}>{item.tenantName}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.paymentInfo}>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Loại thanh toán:</Text>
          <Text style={styles.paymentValue}>{getTypeText(item.type)}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Số tiền:</Text>
          <Text style={styles.paymentValue}>{item.amount}đ</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Ngày thanh toán:</Text>
          <Text style={styles.paymentValue}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách thanh toán</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddPayment")}
        >
          <Text style={styles.addButtonText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockPayments}
        renderItem={renderPaymentItem}
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
  paymentCard: {
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
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tenantName: {
    fontSize: 14,
    color: "#666",
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
  paymentInfo: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#666",
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default PaymentListScreen;
