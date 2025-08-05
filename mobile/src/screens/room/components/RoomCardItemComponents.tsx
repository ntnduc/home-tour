import CardComponent from "@/screens/common/CardComponent";
import { colors } from "@/theme/colors";
import { RoomListResponse, RoomStatus } from "@/types/room";
import { formatDate } from "@/utils/dateUtil";
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

type Props = {
  item: RoomListResponse;
  navigation: any;
};

const RoomCardItemComponent = ({ item, navigation }: Props) => {
  const contract = {
    id: 1,
    roomId: 1,
    roomName: "Phòng 101",
    buildingName: "Tòa Sunrise",
    tenantName: "Nguyễn Văn A",
    tenantPhone: "0123456789",
    tenantEmail: "nguyenvana@email.com",
    tenantIdCard: "123456789",
    tenantAddress: "123 Đường ABC, Quận 1, TP.HCM",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    monthlyRent: 3500000,
    deposit: 3500000,
    status: "ACTIVE",
    createdAt: "2024-01-01",
    signedAt: "2024-01-01",
    services: [
      {
        id: 1,
        name: "Điện",
        price: 3500,
        calculationMethod: "PER_UNIT_SIMPLE",
        isIncluded: true,
      },
      {
        id: 2,
        name: "Nước",
        price: 15000,
        calculationMethod: "PER_UNIT_SIMPLE",
        isIncluded: true,
      },
      {
        id: 3,
        name: "Wifi",
        price: 100000,
        calculationMethod: "FIXED_PER_ROOM",
        isIncluded: true,
      },
      {
        id: 4,
        name: "Gửi xe",
        price: 25000,
        calculationMethod: "FIXED_PER_ROOM",
        isIncluded: true,
      },
    ],
  };

  return (
    <CardComponent
      style={styles.card}
      title={item.name}
      actions={["edit", "delete"]}
      onActionPress={(key) => {
        if (key === "edit") {
          navigation.navigate("UpdateRoom", { roomId: item.id });
        }
      }}
      description={item.property?.name}
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
          <Text style={styles.price}>
            {item.rentAmount?.toLocaleString() ?? ""}đ/tháng
          </Text>
          <View style={styles.roomInfoRow}>
            <Text style={styles.roomInfoText}>Diện tích: {item.area}m²</Text>
            <Text style={styles.roomInfoText}>👤 {item.maxOccupancy}</Text>
          </View>
          {item.description && (
            <Text style={styles.roomDesc}>{item.description}</Text>
          )}

          {/* Thông tin hợp đồng cho phòng đang thuê */}
          {contract && item.status === RoomStatus.OCCUPIED && (
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
          {/* {item.paymentStatus && paymentStatusColor && (
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
                    {PAYMENT_STATUS_LABEL[item.paymentStatus as PaymentStatus]}
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
          )} */}
        </View>
      </View>

      {/* Nút hành động hợp đồng */}
      {item.status === RoomStatus.AVAILABLE ? (
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
      ) : item.status === RoomStatus.OCCUPIED && contract ? (
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
      {/* {item.paymentStatus &&
        (item.paymentStatus === PaymentStatus.PENDING ||
          item.paymentStatus === PaymentStatus.OVERDUE) && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.invoiceBtn}
              onPress={() => {
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
        )} */}
    </CardComponent>
  );
};

export default RoomCardItemComponent;
