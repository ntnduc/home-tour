import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BuildingSelector from "../../components/BuildingSelector";
import PaymentSummary from "../../components/PaymentSummary";
import {
  Invoice,
  PAYMENT_STATUS_COLOR,
  PAYMENT_STATUS_LABEL,
  PaymentStatus,
} from "../../types/payment";
import HeaderComponents from "../common/HeaderComponents";

type RootStackParamList = {
  RoomList: undefined;
  RoomDetail: { roomId: number };
  InvoiceDetail: { invoice: Invoice; fromHistory?: boolean };
  InvoiceHistory: undefined;
};

type RoomListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

// Mock data cho các tòa nhà
const mockBuildings = [
  {
    id: "sunrise",
    name: "Tòa Sunrise",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    roomCount: 6,
  },
  {
    id: "sunset",
    name: "Tòa Sunset",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    roomCount: 4,
  },
];

// Mock data cho hóa đơn
const mockInvoices: Invoice[] = [
  {
    id: 1,
    roomId: 1,
    roomName: "Phòng 101",
    tenantName: "Nguyễn Văn A",
    month: "2024-01",
    totalAmount: 4200000,
    rentAmount: 3500000,
    serviceAmount: 700000,
    services: [
      {
        id: 1,
        name: "Điện",
        price: 3500,
        quantity: 100,
        unit: "số",
        amount: 350000,
      },
      {
        id: 2,
        name: "Nước",
        price: 15000,
        quantity: 15,
        unit: "m³",
        amount: 225000,
      },
      {
        id: 3,
        name: "Wifi",
        price: 100000,
        quantity: 1,
        unit: "tháng",
        amount: 100000,
      },
      {
        id: 4,
        name: "Gửi xe",
        price: 25000,
        quantity: 1,
        unit: "tháng",
        amount: 25000,
      },
    ],
    dueDate: "2024-01-05",
    status: PaymentStatus.OVERDUE,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    roomId: 2,
    roomName: "Phòng 102",
    tenantName: "Trần Thị B",
    month: "2024-01",
    totalAmount: 3800000,
    rentAmount: 3200000,
    serviceAmount: 600000,
    services: [
      {
        id: 1,
        name: "Điện",
        price: 3500,
        quantity: 80,
        unit: "số",
        amount: 280000,
      },
      {
        id: 2,
        name: "Nước",
        price: 15000,
        quantity: 12,
        unit: "m³",
        amount: 180000,
      },
      {
        id: 3,
        name: "Wifi",
        price: 100000,
        quantity: 1,
        unit: "tháng",
        amount: 100000,
      },
      {
        id: 4,
        name: "Gửi xe",
        price: 25000,
        quantity: 1,
        unit: "tháng",
        amount: 25000,
      },
    ],
    dueDate: "2024-01-05",
    status: PaymentStatus.PENDING,
    createdAt: "2024-01-01",
  },
  {
    id: 3,
    roomId: 4,
    roomName: "Phòng 202",
    tenantName: "Lê Văn C",
    month: "2024-01",
    totalAmount: 4500000,
    rentAmount: 3700000,
    serviceAmount: 800000,
    services: [
      {
        id: 1,
        name: "Điện",
        price: 3500,
        quantity: 120,
        unit: "số",
        amount: 420000,
      },
      {
        id: 2,
        name: "Nước",
        price: 15000,
        quantity: 18,
        unit: "m³",
        amount: 270000,
      },
      {
        id: 3,
        name: "Wifi",
        price: 100000,
        quantity: 1,
        unit: "tháng",
        amount: 100000,
      },
      {
        id: 4,
        name: "Gửi xe",
        price: 25000,
        quantity: 1,
        unit: "tháng",
        amount: 25000,
      },
    ],
    dueDate: "2024-01-05",
    status: PaymentStatus.PAID,
    createdAt: "2024-01-01",
    paidAt: "2024-01-03",
  },
];

const mockRoomList = [
  {
    id: 1,
    name: "Phòng 101",
    building: "Tòa Sunrise",
    price: 3500000,
    status: "Đang thuê",
    area: 25,
    tenants: 2,
    description: "Phòng rộng, view đẹp, đầy đủ nội thất.",
    paymentStatus: PaymentStatus.OVERDUE,
    dueDate: "2024-01-05",
  },
  {
    id: 2,
    name: "Phòng 102",
    building: "Tòa Sunrise",
    price: 3200000,
    status: "Trống",
    area: 22,
    tenants: 0,
    description: "Phòng thoáng mát, gần thang máy.",
    paymentStatus: PaymentStatus.PENDING,
    dueDate: "2024-01-05",
  },
  {
    id: 3,
    name: "Phòng 201",
    building: "Tòa Sunset",
    price: 4000000,
    status: "Đang sửa",
    area: 28,
    tenants: 0,
    description: "Phòng đang bảo trì, sẽ sẵn sàng sớm.",
  },
  {
    id: 4,
    name: "Phòng 202",
    building: "Tòa Sunset",
    price: 3700000,
    status: "Đang thuê",
    area: 24,
    tenants: 1,
    description: "Phòng có ban công, ánh sáng tự nhiên.",
    paymentStatus: PaymentStatus.PAID,
    dueDate: "2024-01-05",
  },
  {
    id: 5,
    name: "Phòng 301",
    building: "Tòa Sunrise",
    price: 3600000,
    status: "Trống",
    area: 23,
    tenants: 0,
    description: "Phòng mới, sạch sẽ, an ninh tốt.",
  },
  {
    id: 6,
    name: "Phòng 302",
    building: "Tòa Sunrise",
    price: 3550000,
    status: "Đang thuê",
    area: 21,
    tenants: 1,
    description: "Phòng nhỏ gọn, tiết kiệm chi phí.",
    paymentStatus: PaymentStatus.PENDING,
    dueDate: "2024-01-05",
  },
  {
    id: 7,
    name: "Phòng 401",
    building: "Tòa Sunset",
    price: 4100000,
    status: "Trống",
    area: 30,
    tenants: 0,
    description: "Phòng lớn, phù hợp gia đình nhỏ.",
  },
  {
    id: 8,
    name: "Phòng 402",
    building: "Tòa Sunset",
    price: 4200000,
    status: "Đang thuê",
    area: 32,
    tenants: 3,
    description: "Phòng cao cấp, nhiều tiện nghi.",
    paymentStatus: PaymentStatus.OVERDUE,
    dueDate: "2024-01-05",
  },
  {
    id: 9,
    name: "Phòng 501",
    building: "Tòa Sunrise",
    price: 3900000,
    status: "Đang thuê",
    area: 27,
    tenants: 2,
    description: "Phòng tầng cao, yên tĩnh.",
    paymentStatus: PaymentStatus.PAID,
    dueDate: "2024-01-05",
  },
  {
    id: 10,
    name: "Phòng 502",
    building: "Tòa Sunrise",
    price: 3950000,
    status: "Trống",
    area: 26,
    tenants: 0,
    description: "Phòng đẹp, giá hợp lý.",
  },
];

const statusColor = {
  "Đang thuê": { bg: "#E9F9EF", color: "#34C759" },
  Trống: { bg: "#FFF6E5", color: "#FF9500" },
  "Đang sửa": { bg: "#FFECEC", color: "#FF3B30" },
};

const RoomListScreen = ({ navigation }: RoomListScreenProps) => {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | null>(
    null
  );
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const filteredRooms = mockRoomList.filter(
    (room) =>
      (room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.building.toLowerCase().includes(search.toLowerCase())) &&
      (filterPayment === null || room.paymentStatus === filterPayment) &&
      (selectedBuilding === null ||
        room.building ===
          mockBuildings.find((b) => b.id === selectedBuilding)?.name)
  );

  // Tính toán thống kê thanh toán theo tòa nhà được chọn
  const paymentStats = {
    totalRooms: mockRoomList.filter(
      (room) =>
        room.paymentStatus &&
        (selectedBuilding === null ||
          room.building ===
            mockBuildings.find((b) => b.id === selectedBuilding)?.name)
    ).length,
    pendingPayments: mockRoomList.filter(
      (room) =>
        room.paymentStatus === PaymentStatus.PENDING &&
        (selectedBuilding === null ||
          room.building ===
            mockBuildings.find((b) => b.id === selectedBuilding)?.name)
    ).length,
    overduePayments: mockRoomList.filter(
      (room) =>
        room.paymentStatus === PaymentStatus.OVERDUE &&
        (selectedBuilding === null ||
          room.building ===
            mockBuildings.find((b) => b.id === selectedBuilding)?.name)
    ).length,
    paidPayments: mockRoomList.filter(
      (room) =>
        room.paymentStatus === PaymentStatus.PAID &&
        (selectedBuilding === null ||
          room.building ===
            mockBuildings.find((b) => b.id === selectedBuilding)?.name)
    ).length,
    totalAmount: mockInvoices
      .filter(
        (invoice) =>
          (invoice.status === PaymentStatus.PENDING ||
            invoice.status === PaymentStatus.OVERDUE) &&
          (selectedBuilding === null ||
            mockRoomList.find((room) => room.id === invoice.roomId)
              ?.building ===
              mockBuildings.find((b) => b.id === selectedBuilding)?.name)
      )
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0),
  };

  useEffect(() => {
    setVisibleCount(5);
  }, [search, filterPayment, selectedBuilding]);

  const getInvoiceForRoom = (roomId: number) => {
    return mockInvoices.find((invoice) => invoice.roomId === roomId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderRoomCard = ({ item }: { item: any }) => {
    const status = statusColor[item.status as keyof typeof statusColor] || {
      bg: "#EAF4FF",
      color: "#007AFF",
    };

    const invoice = getInvoiceForRoom(item.id);
    const paymentStatusColor = item.paymentStatus
      ? PAYMENT_STATUS_COLOR[item.paymentStatus as PaymentStatus]
      : null;
    const daysUntilDue = item.dueDate ? getDaysUntilDue(item.dueDate) : null;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("RoomDetail", { roomId: item.id })}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.roomName}>{item.name}</Text>
            <Text style={styles.buildingName}>{item.building}</Text>
            <Text style={styles.price}>
              {item.price.toLocaleString()}đ/tháng
            </Text>
            <View style={styles.roomInfoRow}>
              <Text style={styles.roomInfoText}>Diện tích: {item.area}m²</Text>
              <Text style={styles.roomInfoText}>👤 {item.tenants}</Text>
            </View>
            {item.description && (
              <Text style={styles.roomDesc}>{item.description}</Text>
            )}

            {/* Thông tin thanh toán */}
            {item.paymentStatus && paymentStatusColor && (
              <View style={styles.paymentInfo}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>
                    Trạng thái thanh toán:
                  </Text>
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
                      {
                        PAYMENT_STATUS_LABEL[
                          item.paymentStatus as PaymentStatus
                        ]
                      }
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
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => {
              /* Xử lý update phòng */
            }}
          >
            <Ionicons name="pencil" size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {item.status}
            </Text>
          </View>
        </View>

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
                <Ionicons name="receipt-outline" size={16} color="#007AFF" />
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
                <Ionicons name="card-outline" size={16} color="#fff" />
                <Text style={styles.payBtnText}>Thanh toán</Text>
              </TouchableOpacity>
            </View>
          )}
      </TouchableOpacity>
    );
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPayment === null && styles.filterButtonActive,
          ]}
          onPress={() => setFilterPayment(null)}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterPayment === null && styles.filterButtonTextActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPayment === PaymentStatus.PENDING &&
              styles.filterButtonActive,
          ]}
          onPress={() => setFilterPayment(PaymentStatus.PENDING)}
        >
          <Ionicons
            name="time-outline"
            size={14}
            color={filterPayment === PaymentStatus.PENDING ? "#fff" : "#666"}
          />
          <Text
            style={[
              styles.filterButtonText,
              filterPayment === PaymentStatus.PENDING &&
                styles.filterButtonTextActive,
            ]}
          >
            Chờ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPayment === PaymentStatus.OVERDUE &&
              styles.filterButtonActive,
          ]}
          onPress={() => setFilterPayment(PaymentStatus.OVERDUE)}
        >
          <Ionicons
            name="warning-outline"
            size={14}
            color={filterPayment === PaymentStatus.OVERDUE ? "#fff" : "#666"}
          />
          <Text
            style={[
              styles.filterButtonText,
              filterPayment === PaymentStatus.OVERDUE &&
                styles.filterButtonTextActive,
            ]}
          >
            Quá hạn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPayment === PaymentStatus.PAID && styles.filterButtonActive,
          ]}
          onPress={() => setFilterPayment(PaymentStatus.PAID)}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={14}
            color={filterPayment === PaymentStatus.PAID ? "#fff" : "#666"}
          />
          <Text
            style={[
              styles.filterButtonText,
              filterPayment === PaymentStatus.PAID &&
                styles.filterButtonTextActive,
            ]}
          >
            Đã thanh toán
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header cố định */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerTop}>
          <HeaderComponents
            title="Danh Sách Phòng"
            isSearch
            className="mx-2"
            searchConfig={{
              placeholder: "Tìm kiếm phòng hoặc tòa nhà...",
              onSearch: (text) => setSearch(text),
            }}
          />
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("InvoiceHistory")}
          >
            <Ionicons name="time-outline" size={20} color="#007AFF" />
            <Text style={styles.historyButtonText}>Lịch sử</Text>
          </TouchableOpacity>
        </View>
        <BuildingSelector
          buildings={mockBuildings}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={setSelectedBuilding}
        />
        {renderFilterButtons()}
      </View>

      {/* Danh sách phòng có thể scroll */}
      <View style={styles.scrollContainer}>
        <FlatList
          data={filteredRooms.slice(0, visibleCount)}
          renderItem={renderRoomCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <PaymentSummary
              totalRooms={paymentStats.totalRooms}
              pendingPayments={paymentStats.pendingPayments}
              overduePayments={paymentStats.overduePayments}
              paidPayments={paymentStats.paidPayments}
              totalAmount={paymentStats.totalAmount}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Không tìm thấy phòng phù hợp.
              </Text>
            </View>
          }
          onEndReached={() => {
            if (visibleCount < filteredRooms.length) {
              setVisibleCount((prev) =>
                Math.min(prev + 5, filteredRooms.length)
              );
            }
          }}
          onEndReachedThreshold={0.2}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          /* Xử lý tạo phòng */
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fixedHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 14,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FB",
    borderRadius: 16,
    marginBottom: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: "#222",
    backgroundColor: "transparent",
  },
  filterContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingVertical: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    gap: 4,
    minWidth: 60,
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  roomName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  buildingName: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
  price: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "bold",
    marginBottom: 4,
  },
  updateBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  statusRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  roomInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 2,
    gap: 12,
  },
  roomInfoText: {
    fontSize: 13,
    color: "#666",
    marginRight: 8,
  },
  roomDesc: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
    fontStyle: "italic",
  },
  paymentInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  paymentLabel: {
    fontSize: 12,
    color: "#666",
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  paymentDateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  normalText: {
    color: "#666",
  },
  warningText: {
    color: "#FF9500",
  },
  overdueText: {
    color: "#FF3B30",
  },
  daysText: {
    fontSize: 11,
    fontStyle: "italic",
  },
  invoiceAmount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  invoiceBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "#F0F4FF",
    gap: 4,
  },
  invoiceBtnText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  payBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    gap: 4,
  },
  payBtnText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContent: {
    padding: 10,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
    paddingVertical: 20,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F0F4FF",
    gap: 4,
  },
  historyButtonText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
});

export default RoomListScreen;
