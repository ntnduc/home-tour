import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PAYMENT_STATUS_COLOR, PaymentStatus } from "../types/payment";

interface PaymentSummaryProps {
  totalRooms: number;
  pendingPayments: number;
  overduePayments: number;
  paidPayments: number;
  totalAmount: number;
}

const PaymentSummary = ({
  totalRooms,
  pendingPayments,
  overduePayments,
  paidPayments,
  totalAmount,
}: PaymentSummaryProps) => {
  const pendingColor = PAYMENT_STATUS_COLOR[PaymentStatus.PENDING];
  const overdueColor = PAYMENT_STATUS_COLOR[PaymentStatus.OVERDUE];
  const paidColor = PAYMENT_STATUS_COLOR[PaymentStatus.PAID];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tổng quan thanh toán</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.statBadge, { backgroundColor: "#E3F2FD" }]}>
            <Text style={[styles.statNumber, { color: "#1976D2" }]}>
              {totalRooms}
            </Text>
          </View>
          <Text style={styles.statLabel}>Tổng phòng</Text>
        </View>

        <View style={styles.statItem}>
          <View
            style={[styles.statBadge, { backgroundColor: pendingColor.bg }]}
          >
            <Text style={[styles.statNumber, { color: pendingColor.color }]}>
              {pendingPayments}
            </Text>
          </View>
          <Text style={styles.statLabel}>Chờ thanh toán</Text>
        </View>

        <View style={styles.statItem}>
          <View
            style={[styles.statBadge, { backgroundColor: overdueColor.bg }]}
          >
            <Text style={[styles.statNumber, { color: overdueColor.color }]}>
              {overduePayments}
            </Text>
          </View>
          <Text style={styles.statLabel}>Quá hạn</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statBadge, { backgroundColor: paidColor.bg }]}>
            <Text style={[styles.statNumber, { color: paidColor.color }]}>
              {paidPayments}
            </Text>
          </View>
          <Text style={styles.statLabel}>Đã thanh toán</Text>
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Tổng tiền cần thu:</Text>
        <Text style={styles.totalAmount}>{totalAmount.toLocaleString()}đ</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 2,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  totalLabel: {
    fontSize: 13,
    color: "#666",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
});

export default PaymentSummary;
