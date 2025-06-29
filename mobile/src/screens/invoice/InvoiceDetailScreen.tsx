import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Invoice,
  PAYMENT_STATUS_COLOR,
  PAYMENT_STATUS_LABEL,
  PaymentStatus,
} from "../../types/payment";

type RootStackParamList = {
  InvoiceDetail: { invoice: Invoice; fromHistory?: boolean };
  InvoiceHistory: undefined;
};

type InvoiceDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: { params: { invoice: Invoice } };
};

const InvoiceDetailScreen = ({
  navigation,
  route,
}: InvoiceDetailScreenProps) => {
  const { invoice } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmPayment = () => {
    Alert.alert(
      "Xác nhận thanh toán",
      `Bạn có chắc chắn muốn xác nhận thanh toán cho hóa đơn này?\n\nSố tiền: ${invoice.totalAmount.toLocaleString()}đ`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            setIsProcessing(true);
            // TODO: Gọi API xác nhận thanh toán
            setTimeout(() => {
              setIsProcessing(false);
              Alert.alert("Thành công", "Đã xác nhận thanh toán thành công!", [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ]);
            }, 2000);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusColor = PAYMENT_STATUS_COLOR[invoice.status];
  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysOverdue = getDaysOverdue(invoice.dueDate);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card chính */}
        <View style={styles.mainCard}>
          {/* Header card */}
          <View style={styles.cardHeader}>
            <View style={styles.roomInfo}>
              <Text style={styles.roomName}>{invoice.roomName}</Text>
              <Text style={styles.tenantName}>{invoice.tenantName}</Text>
              <Text style={styles.monthText}>
                {new Date(invoice.month + "-01").toLocaleDateString("vi-VN", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor.bg },
              ]}
            >
              <Ionicons
                name={
                  invoice.status === PaymentStatus.PAID
                    ? "checkmark-circle"
                    : invoice.status === PaymentStatus.OVERDUE
                      ? "warning"
                      : "time"
                }
                size={16}
                color={getStatusColor.color}
              />
              <Text
                style={[styles.statusText, { color: getStatusColor.color }]}
              >
                {PAYMENT_STATUS_LABEL[invoice.status]}
              </Text>
            </View>
          </View>

          {/* Cảnh báo quá hạn */}
          {invoice.status === PaymentStatus.OVERDUE && (
            <View style={styles.overdueWarning}>
              <Ionicons name="warning" size={20} color="#FF3B30" />
              <View style={styles.overdueInfo}>
                <Text style={styles.overdueTitle}>Hóa đơn quá hạn</Text>
                <Text style={styles.overdueDays}>{daysOverdue} ngày</Text>
              </View>
            </View>
          )}

          {/* Tổng tiền nổi bật */}
          <View style={styles.totalAmountSection}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalAmount}>
              {invoice.totalAmount.toLocaleString()}đ
            </Text>
          </View>
        </View>

        {/* Thông tin chi tiết */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Chi tiết hóa đơn</Text>

          {/* Tiền thuê */}
          <View style={styles.detailItem}>
            <View style={styles.detailLeft}>
              <View style={styles.detailIcon}>
                <Ionicons name="home" size={16} color="#007AFF" />
              </View>
              <View style={styles.detailText}>
                <Text style={styles.detailName}>Tiền thuê phòng</Text>
                <Text style={styles.detailDesc}>Phí thuê cơ bản</Text>
              </View>
            </View>
            <Text style={styles.detailAmount}>
              {invoice.rentAmount.toLocaleString()}đ
            </Text>
          </View>

          {/* Dịch vụ */}
          {invoice.services.map((service) => (
            <View key={service.id} style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <View style={styles.detailIcon}>
                  <Ionicons
                    name={
                      service.name === "Điện"
                        ? "flash"
                        : service.name === "Nước"
                          ? "water"
                          : service.name === "Wifi"
                            ? "wifi"
                            : "car"
                    }
                    size={16}
                    color="#34C759"
                  />
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.detailName}>{service.name}</Text>
                  {service.quantity && service.unit && (
                    <Text style={styles.detailDesc}>
                      {service.quantity} {service.unit} ×{" "}
                      {service.price.toLocaleString()}đ
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.detailAmount}>
                {service.amount.toLocaleString()}đ
              </Text>
            </View>
          ))}
        </View>

        {/* Thông tin bổ sung - Thiết kế mới */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>

          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <View style={styles.infoCardIcon}>
                <Ionicons name="calendar" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Hạn thanh toán</Text>
                <Text style={styles.infoCardValue}>
                  {formatDate(invoice.dueDate)}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardIcon}>
                <Ionicons name="create" size={20} color="#666" />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Ngày tạo</Text>
                <Text style={styles.infoCardValue}>
                  {formatDate(invoice.createdAt)}
                </Text>
              </View>
            </View>

            {invoice.paidAt && (
              <View style={styles.infoCard}>
                <View
                  style={[styles.infoCardIcon, { backgroundColor: "#E9F9EF" }]}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Ngày thanh toán</Text>
                  <Text style={styles.infoCardValue}>
                    {formatDate(invoice.paidAt)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Nút hành động */}
      {invoice.status === PaymentStatus.PENDING ||
      invoice.status === PaymentStatus.OVERDUE ? (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleConfirmPayment}
            disabled={isProcessing}
          >
            <Ionicons
              name={isProcessing ? "hourglass" : "checkmark-circle"}
              size={20}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>
              {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  tenantName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 2,
  },
  monthText: {
    fontSize: 14,
    color: "#888",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  overdueWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFECEC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  overdueInfo: {
    flex: 1,
  },
  overdueTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF3B30",
    marginBottom: 2,
  },
  overdueDays: {
    fontSize: 12,
    color: "#FF3B30",
  },
  totalAmountSection: {
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
  },
  detailsSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailText: {
    flex: 1,
  },
  detailName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  detailDesc: {
    fontSize: 12,
    color: "#666",
  },
  detailAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  actionContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  actionButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default InvoiceDetailScreen;
