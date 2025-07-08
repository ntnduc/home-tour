import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BuildingSelector from "../../components/BuildingSelector";
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
import RoomCardItemComponent from "./components/RoomCardItemComponents";
import styles from "./styles/StyleRoomList";

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
        <HeaderComponents
          className="px-2 mb-2"
          title="Danh Sách Phòng"
          isSearch
          searchConfig={{
            placeholder: "Tìm kiếm phòng hoặc tòa nhà...",
            onSearch: (text) => setSearch(text),
          }}
        />
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

      <View style={styles.scrollContainer}>
        <FlatList
          data={filteredRooms.slice(0, visibleCount)}
          renderItem={({ item }) => (
            <RoomCardItemComponent
              item={item}
              navigation={navigation}
              getInvoiceForRoom={getInvoiceForRoom}
              getContractForRoom={getContractForRoom}
              formatDate={formatDate}
              getDaysUntilDue={getDaysUntilDue}
              PaymentStatus={PaymentStatus}
              PAYMENT_STATUS_COLOR={PAYMENT_STATUS_COLOR}
              PAYMENT_STATUS_LABEL={PAYMENT_STATUS_LABEL}
              colors={colors}
            />
          )}
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
    </SafeAreaView>
  );
};

export default RoomListScreen;
