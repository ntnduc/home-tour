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
import ContractListModal from "../../components/ContractListModal";
import PaymentSummary from "../../components/PaymentSummary";
import { colors } from "../../theme/colors";
import { Contract, ContractStatus } from "../../types/contract";
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
  UpdateRoom: { room: any };
  InvoiceDetail: { invoice: Invoice; fromHistory?: boolean };
  InvoiceHistory: undefined;
  // Contract management routes
  CreateContract: { room: any };
  ContractDetail: { contract: any };
  TerminateContract: { contract: any };
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
  "Đang thuê": {
    bg: colors.status.success + "20",
    color: colors.status.success,
  },
  Trống: { bg: colors.status.warning + "20", color: colors.status.warning },
  "Đang sửa": { bg: colors.status.error + "20", color: colors.status.error },
};

const RoomListScreen = ({ navigation }: RoomListScreenProps) => {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | null>(
    null
  );
  const [selectedBuilding, setSelectedBuilding] = useState<string>("Tất cả");
  const [showContractModal, setShowContractModal] = useState(false);

  const filteredRooms = mockRoomList.filter(
    (room) =>
      (room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.building.toLowerCase().includes(search.toLowerCase())) &&
      (filterPayment === null || room.paymentStatus === filterPayment) &&
      (selectedBuilding === "Tất cả" || room.building === selectedBuilding)
  );

  // Tính toán thống kê thanh toán theo tòa nhà được chọn
  const paymentStats = {
    totalRooms: mockRoomList.filter(
      (room) =>
        room.paymentStatus &&
        (selectedBuilding === "Tất cả" || room.building === selectedBuilding)
    ).length,
    pendingPayments: mockRoomList.filter(
      (room) =>
        room.paymentStatus === PaymentStatus.PENDING &&
        (selectedBuilding === "Tất cả" || room.building === selectedBuilding)
    ).length,
    overduePayments: mockRoomList.filter(
      (room) =>
        room.paymentStatus === PaymentStatus.OVERDUE &&
        (selectedBuilding === "Tất cả" || room.building === selectedBuilding)
    ).length,
    paidPayments: mockRoomList.filter(
      (room) =>
        room.paymentStatus === PaymentStatus.PAID &&
        (selectedBuilding === "Tất cả" || room.building === selectedBuilding)
    ).length,
    totalAmount: mockInvoices
      .filter(
        (invoice) =>
          (invoice.status === PaymentStatus.PENDING ||
            invoice.status === PaymentStatus.OVERDUE) &&
          (selectedBuilding === "Tất cả" ||
            mockRoomList.find((room) => room.id === invoice.roomId)
              ?.building === selectedBuilding)
      )
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0),
  };

  useEffect(() => {
    setVisibleCount(5);
  }, [search, filterPayment, selectedBuilding]);

  const getInvoiceForRoom = (roomId: number) => {
    return mockInvoices.find((invoice) => invoice.roomId === roomId);
  };

  const getContractForRoom = (roomId: number) => {
    return mockContracts.find((contract) => contract.roomId === roomId);
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
    const contract = getContractForRoom(item.id);
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
            <View style={styles.titleRow}>
              <Text style={styles.roomName}>{item.name}</Text>
              <View
                style={[styles.statusBadge, { backgroundColor: status.bg }]}
              >
                <Text style={[styles.statusText, { color: status.color }]}>
                  {item.status}
                </Text>
              </View>
            </View>
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
              navigation.navigate("UpdateRoom", { room: item });
            }}
          >
            <Ionicons name="pencil" size={18} color={colors.primary.main} />
          </TouchableOpacity>
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
            color={
              filterPayment === PaymentStatus.PENDING
                ? colors.neutral.white
                : colors.text.secondary
            }
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
            color={
              filterPayment === PaymentStatus.OVERDUE
                ? colors.neutral.white
                : colors.text.secondary
            }
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
            color={
              filterPayment === PaymentStatus.PAID
                ? colors.neutral.white
                : colors.text.secondary
            }
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

  const handleContractPress = (contract: Contract) => {
    setShowContractModal(false);
    // TODO: Navigate to contract detail
    console.log("View contract:", contract.id);
  };

  const handleTerminatePress = (contract: Contract) => {
    setShowContractModal(false);
    // TODO: Navigate to terminate contract
    console.log("Terminate contract:", contract.id);
  };

  const handleRenewPress = (contract: Contract) => {
    setShowContractModal(false);
    // TODO: Navigate to renew contract
    console.log("Renew contract:", contract.id);
  };

  // Mock contracts data
  const mockContracts: Contract[] = [
    {
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
      status: ContractStatus.ACTIVE,
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
    },
    // Add more mock contracts as needed
  ];

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
          <View className="flex-row gap-2">
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => navigation.navigate("InvoiceHistory")}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.primary.main}
              />
              <Text style={styles.historyButtonText}>Lịch sử</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contractButton}
              onPress={() => setShowContractModal(true)}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.primary.main}
              />
              <Text style={styles.contractButtonText}>Hợp đồng</Text>
            </TouchableOpacity>
          </View>
        </View>
        <BuildingSelector
          buildings={mockBuildings}
          selectedBuilding={
            selectedBuilding === "Tất cả" ? null : selectedBuilding
          }
          onSelectBuilding={(buildingId) =>
            setSelectedBuilding(buildingId === null ? "Tất cả" : buildingId)
          }
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
        <Ionicons name="add" size={32} color={colors.neutral.white} />
      </TouchableOpacity>

      {/* Contract List Modal */}
      <ContractListModal
        visible={showContractModal}
        onClose={() => setShowContractModal(false)}
        contracts={mockContracts}
        onContractPress={handleContractPress}
        onTerminatePress={handleTerminatePress}
        onRenewPress={handleRenewPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  fixedHeader: {
    backgroundColor: colors.background.default,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
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
    color: colors.text.primary,
    marginBottom: 14,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral.gray[100],
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
    color: colors.text.primary,
    backgroundColor: "transparent",
  },
  filterContainer: {
    backgroundColor: colors.background.default,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
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
    borderColor: colors.border.main,
    backgroundColor: colors.background.default,
    gap: 4,
    minWidth: 60,
  },
  filterButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: colors.neutral.white,
    fontWeight: "600",
  },
  card: {
    backgroundColor: colors.background.default,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  roomName: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.text.primary,
    flex: 1,
  },
  buildingName: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  price: {
    fontSize: 15,
    color: colors.primary.main,
    fontWeight: "bold",
    marginBottom: 4,
  },
  updateBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.primary.light,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  statusRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: colors.primary.main,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary.main,
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
    color: colors.text.secondary,
    marginRight: 8,
  },
  roomDesc: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
    fontStyle: "italic",
  },
  paymentInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  paymentLabel: {
    fontSize: 12,
    color: colors.text.secondary,
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
    color: colors.text.secondary,
  },
  warningText: {
    color: colors.status.warning,
  },
  overdueText: {
    color: colors.status.error,
  },
  daysText: {
    fontSize: 11,
    fontStyle: "italic",
  },
  invoiceAmount: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary.main,
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
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
    gap: 4,
  },
  invoiceBtnText: {
    fontSize: 12,
    color: colors.primary.main,
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
    backgroundColor: colors.primary.main,
    gap: 4,
  },
  payBtnText: {
    fontSize: 12,
    color: colors.neutral.white,
    fontWeight: "500",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background.paper,
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
    color: colors.text.secondary,
    fontSize: 16,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary.light,
    gap: 4,
  },
  historyButtonText: {
    fontSize: 12,
    color: colors.primary.main,
    fontWeight: "500",
  },
  contractInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  contractRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  contractLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  contractText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text.primary,
  },
  createContractBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
    gap: 4,
  },
  createContractBtnText: {
    fontSize: 12,
    color: colors.primary.main,
    fontWeight: "500",
  },
  viewContractBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
    gap: 4,
  },
  viewContractBtnText: {
    fontSize: 12,
    color: colors.primary.main,
    fontWeight: "500",
  },
  terminateContractBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.status.error,
    backgroundColor: colors.secondary.light,
    gap: 4,
  },
  terminateContractBtnText: {
    fontSize: 12,
    color: colors.status.error,
    fontWeight: "500",
  },
  contractButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary.light,
    gap: 4,
  },
  contractButtonText: {
    fontSize: 12,
    color: colors.primary.main,
    fontWeight: "500",
  },
});

export default RoomListScreen;
