import CardComponent from "@/screens/common/CardComponent";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/StyleRoomCardItemCompoent";

const statusColor = {
  "Đang thuê": {
    bg: "#22C55E20",
    color: "#22C55E",
  },
  Trống: { bg: "#F59E4220", color: "#F59E42" },
  "Đang sửa": { bg: "#EF444420", color: "#EF4444" },
};

const RoomCardItemComponent = ({
  item,
  navigation,
  getInvoiceForRoom,
  getContractForRoom,
  formatDate,
  getDaysUntilDue,
  PaymentStatus,
  PAYMENT_STATUS_COLOR,
  PAYMENT_STATUS_LABEL,
  colors,
}: any) => {
  const status = statusColor[item.status as keyof typeof statusColor] || {
    bg: "#EAF4FF",
    color: "#007AFF",
  };

  const invoice = getInvoiceForRoom(item.id);
  const contract = getContractForRoom(item.id);
  const paymentStatusColor = item.paymentStatus
    ? PAYMENT_STATUS_COLOR[item.paymentStatus as typeof PaymentStatus]
    : null;
  const daysUntilDue = item.dueDate ? getDaysUntilDue(item.dueDate) : null;

  return (
    <CardComponent
      style={styles.card}
      title={item.name}
      actions={["edit", "delete"]}
      onActionPress={(key) => {
        console.log("💞💓💗💞💓💗 ~ onActionPress ~ key:", key);
      }}
      description={item.building}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          {/* <View style={styles.titleRow}>
            <Text style={styles.roomName}>{item.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.color }]}>
                {item.status}
              </Text>
            </View>
          </View> */}
          {/* <Text style={styles.buildingName}>{item.building}</Text> */}
          <Text style={styles.price}>{item.price.toLocaleString()}đ/tháng</Text>
          <View style={styles.roomInfoRow}>
            <Text style={styles.roomInfoText}>Diện tích: {item.area}m²</Text>
            <Text style={styles.roomInfoText}>👤 {item.tenants}</Text>
          </View>
          {item.description && (
            <Text style={styles.roomDesc}>{item.description}</Text>
          )}

          {/* Thông tin hợp đồng cho phòng đang thuê */}
          {contract && item.status === "Đang thuê" && (
            <View style={styles.contractInfo}>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>Người thuê:</Text>
                <Text style={styles.contractText}>{contract.tenantName}</Text>
              </View>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>Hợp đồng:</Text>
                <Text style={styles.contractText}>
                  #{contract.id} - {formatDate(contract.startDate)} đến{" "}
                  {formatDate(contract.endDate)}
                </Text>
              </View>
            </View>
          )}

          {/* Thông tin thanh toán */}
          {item.paymentStatus && paymentStatusColor && (
            <View style={styles.paymentInfo}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Trạng thái thanh toán:</Text>
                <View
                  style={[
                    styles.paymentStatusBadge,
                    { backgroundColor: paymentStatusColor.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.paymentStatusText,
                      { color: paymentStatusColor.color },
                    ]}
                  >
                    {PAYMENT_STATUS_LABEL[item.paymentStatus]}
                  </Text>
                </View>
              </View>
              {item.dueDate && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Hạn thanh toán:</Text>
                  <Text
                    style={[
                      styles.paymentDateText,
                      daysUntilDue && daysUntilDue < 0
                        ? styles.overdueText
                        : daysUntilDue && daysUntilDue <= 3
                        ? styles.warningText
                        : styles.normalText,
                    ]}
                  >
                    {formatDate(item.dueDate)}
                    {daysUntilDue !== null && (
                      <Text style={styles.daysText}>
                        {daysUntilDue < 0
                          ? ` (Quá hạn ${Math.abs(daysUntilDue)} ngày)`
                          : daysUntilDue === 0
                          ? " (Hôm nay)"
                          : daysUntilDue <= 3
                          ? ` (Còn ${daysUntilDue} ngày)`
                          : ""}
                      </Text>
                    )}
                  </Text>
                </View>
              )}
              {invoice && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Tổng hóa đơn:</Text>
                  <Text style={styles.invoiceAmount}>
                    {invoice.totalAmount.toLocaleString()}đ
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Nút hành động hợp đồng */}
      {item.status === "Trống" ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.createContractBtn}
            onPress={() => {
              navigation.navigate("CreateContract", { room: item });
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={16}
              color={colors.primary.main}
            />
            <Text style={styles.createContractBtnText}>Tạo hợp đồng</Text>
          </TouchableOpacity>
        </View>
      ) : item.status === "Đang thuê" && contract ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.viewContractBtn}
            onPress={() => {
              navigation.navigate("ContractDetail", { contract });
            }}
          >
            <Ionicons
              name="document-outline"
              size={16}
              color={colors.primary.main}
            />
            <Text style={styles.viewContractBtnText}>Xem hợp đồng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.terminateContractBtn}
            onPress={() => {
              navigation.navigate("TerminateContract", { contract });
            }}
          >
            <Ionicons
              name="close-circle-outline"
              size={16}
              color={colors.status.error}
            />
            <Text style={styles.terminateContractBtnText}>Kết thúc</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Nút hành động thanh toán */}
      {item.paymentStatus &&
        (item.paymentStatus === PaymentStatus.PENDING ||
          item.paymentStatus === PaymentStatus.OVERDUE) && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.invoiceBtn}
              onPress={() => {
                const invoice = getInvoiceForRoom(item.id);
                if (invoice) {
                  navigation.navigate("InvoiceDetail", {
                    invoice,
                    fromHistory: false,
                  });
                }
              }}
            >
              <Ionicons
                name="receipt-outline"
                size={16}
                color={colors.primary.main}
              />
              <Text style={styles.invoiceBtnText}>Xem hóa đơn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => {
                const invoice = getInvoiceForRoom(item.id);
                if (invoice) {
                  navigation.navigate("InvoiceDetail", {
                    invoice,
                    fromHistory: false,
                  });
                }
              }}
            >
              <Ionicons
                name="card-outline"
                size={16}
                color={colors.neutral.white}
              />
              <Text style={styles.payBtnText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        )}
    </CardComponent>
  );
};

export default RoomCardItemComponent;
