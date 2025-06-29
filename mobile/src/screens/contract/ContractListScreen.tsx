import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ContractCard from "../../components/ContractCard";
import { colors } from "../../theme/colors";
import { Contract, ContractStatus } from "../../types/contract";
import HeaderComponents from "../common/HeaderComponents";

type RootStackParamList = {
  ContractList: undefined;
  ContractDetail: { contract: Contract };
  TerminateContract: { contract: Contract };
  RoomList: undefined;
};

type ContractListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

// Mock data cho danh sách hợp đồng
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
  {
    id: 2,
    roomId: 4,
    roomName: "Phòng 202",
    buildingName: "Tòa Sunset",
    tenantName: "Lê Văn C",
    tenantPhone: "0987654321",
    tenantEmail: "levanc@email.com",
    tenantIdCard: "987654321",
    tenantAddress: "456 Đường XYZ, Quận 2, TP.HCM",
    startDate: "2024-01-15",
    endDate: "2024-12-15",
    monthlyRent: 3700000,
    deposit: 3700000,
    status: ContractStatus.ACTIVE,
    createdAt: "2024-01-15",
    signedAt: "2024-01-15",
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
  {
    id: 3,
    roomId: 6,
    roomName: "Phòng 302",
    buildingName: "Tòa Sunrise",
    tenantName: "Trần Thị D",
    tenantPhone: "0555666777",
    tenantEmail: "tranthid@email.com",
    tenantIdCard: "555666777",
    tenantAddress: "789 Đường DEF, Quận 3, TP.HCM",
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    monthlyRent: 3550000,
    deposit: 3550000,
    status: ContractStatus.ACTIVE,
    createdAt: "2024-02-01",
    signedAt: "2024-02-01",
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
  {
    id: 4,
    roomId: 8,
    roomName: "Phòng 402",
    buildingName: "Tòa Sunset",
    tenantName: "Phạm Văn E",
    tenantPhone: "0111222333",
    tenantEmail: "phamvane@email.com",
    tenantIdCard: "111222333",
    tenantAddress: "321 Đường GHI, Quận 4, TP.HCM",
    startDate: "2024-01-10",
    endDate: "2024-12-10",
    monthlyRent: 4200000,
    deposit: 4200000,
    status: ContractStatus.TERMINATED,
    createdAt: "2024-01-10",
    signedAt: "2024-01-10",
    terminatedAt: "2024-06-15",
    terminationReason: "Người thuê tự ý chấm dứt",
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
  {
    id: 5,
    roomId: 9,
    roomName: "Phòng 501",
    buildingName: "Tòa Sunrise",
    tenantName: "Hoàng Thị F",
    tenantPhone: "0444555666",
    tenantEmail: "hoangthif@email.com",
    tenantIdCard: "444555666",
    tenantAddress: "654 Đường JKL, Quận 5, TP.HCM",
    startDate: "2024-01-20",
    endDate: "2024-12-20",
    monthlyRent: 3900000,
    deposit: 3900000,
    status: ContractStatus.EXPIRED,
    createdAt: "2024-01-20",
    signedAt: "2024-01-20",
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
];

const ContractListScreen = ({ navigation }: ContractListScreenProps) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ContractStatus | null>(null);

  const filteredContracts = mockContracts.filter(
    (contract) =>
      (contract.tenantName.toLowerCase().includes(search.toLowerCase()) ||
        contract.roomName.toLowerCase().includes(search.toLowerCase()) ||
        contract.buildingName.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === null || contract.status === filterStatus)
  );

  // Tính toán thống kê
  const stats = {
    total: mockContracts.length,
    active: mockContracts.filter((c) => c.status === ContractStatus.ACTIVE)
      .length,
    expired: mockContracts.filter((c) => c.status === ContractStatus.EXPIRED)
      .length,
    terminated: mockContracts.filter(
      (c) => c.status === ContractStatus.TERMINATED
    ).length,
  };

  const renderFilterButtons = () => (
    <View
      style={{
        backgroundColor: colors.background.default,
        borderBottomColor: colors.border.light,
        borderBottomWidth: 1,
        paddingVertical: 8,
      }}
    >
      <View style={{ flexDirection: "row", paddingHorizontal: 16, gap: 8 }}>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor:
              filterStatus === null ? colors.primary.main : colors.border.main,
            backgroundColor:
              filterStatus === null
                ? colors.primary.main
                : colors.background.default,
          }}
          onPress={() => setFilterStatus(null)}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color:
                filterStatus === null
                  ? colors.text.inverse
                  : colors.text.secondary,
            }}
          >
            Tất cả ({stats.total})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor:
              filterStatus === ContractStatus.ACTIVE
                ? colors.status.success
                : colors.border.main,
            backgroundColor:
              filterStatus === ContractStatus.ACTIVE
                ? colors.status.success
                : colors.background.default,
          }}
          onPress={() => setFilterStatus(ContractStatus.ACTIVE)}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color:
                filterStatus === ContractStatus.ACTIVE
                  ? colors.text.inverse
                  : colors.text.secondary,
            }}
          >
            Đang hoạt động ({stats.active})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor:
              filterStatus === ContractStatus.EXPIRED
                ? colors.status.warning
                : colors.border.main,
            backgroundColor:
              filterStatus === ContractStatus.EXPIRED
                ? colors.status.warning
                : colors.background.default,
          }}
          onPress={() => setFilterStatus(ContractStatus.EXPIRED)}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color:
                filterStatus === ContractStatus.EXPIRED
                  ? colors.text.inverse
                  : colors.text.secondary,
            }}
          >
            Hết hạn ({stats.expired})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor:
              filterStatus === ContractStatus.TERMINATED
                ? colors.status.error
                : colors.border.main,
            backgroundColor:
              filterStatus === ContractStatus.TERMINATED
                ? colors.status.error
                : colors.background.default,
          }}
          onPress={() => setFilterStatus(ContractStatus.TERMINATED)}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color:
                filterStatus === ContractStatus.TERMINATED
                  ? colors.text.inverse
                  : colors.text.secondary,
            }}
          >
            Đã kết thúc ({stats.terminated})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContractCard = ({ item }: { item: Contract }) => (
    <ContractCard
      contract={item}
      onPress={() => navigation.navigate("ContractDetail", { contract: item })}
      showActions={true}
      onViewDetails={() =>
        navigation.navigate("ContractDetail", { contract: item })
      }
      onTerminate={() =>
        navigation.navigate("TerminateContract", { contract: item })
      }
      onRenew={() => {
        // TODO: Implement renew contract
        console.log("Renew contract:", item.id);
      }}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.paper }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.default}
      />

      {/* Header */}
      <View
        style={{
          backgroundColor: colors.background.default,
          borderBottomColor: colors.border.light,
          borderBottomWidth: 1,
        }}
      >
        <HeaderComponents
          title="Danh Sách Hợp Đồng"
          isSearch
          className="mx-2"
          searchConfig={{
            placeholder: "Tìm kiếm hợp đồng...",
            onSearch: (text) => setSearch(text),
          }}
        />
        {renderFilterButtons()}
      </View>

      {/* Danh sách hợp đồng */}
      <FlatList
        data={filteredContracts}
        renderItem={renderContractCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 80,
            }}
          >
            <Ionicons
              name="document-outline"
              size={64}
              color={colors.neutral.gray[500]}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: colors.text.secondary,
                marginTop: 16,
              }}
            >
              Không tìm thấy hợp đồng
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.text.disabled,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary.main,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.neutral.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
        onPress={() => {
          // Navigate to room list to select a room for creating contract
          navigation.navigate("RoomList");
        }}
      >
        <Ionicons name="add" size={24} color={colors.text.inverse} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ContractListScreen;
