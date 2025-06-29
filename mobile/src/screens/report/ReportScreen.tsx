import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import BuildingDetailCard from "../../components/BuildingDetailCard";
import CustomTabBar from "../../components/CustomTabBar";
import EnhancedChart from "../../components/EnhancedChart";
import FilterTabs from "../../components/FilterTabs";
import ProgressBar from "../../components/ProgressBar";
import StatCard from "../../components/StatCard";
import { colors } from "../../theme/colors";
import HeaderComponents from "../common/HeaderComponents";

// Mock data cho báo cáo
const mockRevenueData = {
  currentMonth: 12500000,
  expectedNextMonth: 13800000,
  totalRevenue: 156000000,
  occupancyRate: 92,
  totalBuildings: 8,
  totalRooms: 156,
  occupiedRooms: 143,
  vacantRooms: 13,
};

const mockChartData = [
  { label: "T7", value: 11000000, color: colors.primary.main },
  { label: "T8", value: 11500000, color: colors.primary.main },
  { label: "T9", value: 11800000, color: colors.primary.main },
  { label: "T10", value: 12200000, color: colors.primary.main },
  { label: "T11", value: 12000000, color: colors.primary.main },
  { label: "T12", value: 12500000, color: colors.primary.main },
];

const mockBuildingData = [
  {
    id: 1,
    name: "Tòa A - Khu đô thị Xanh",
    revenue: 3200000,
    occupancy: 95,
    rooms: 24,
    occupied: 23,
    status: "active",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    monthlyGrowth: 5.2,
    avgRent: 850000,
  },
  {
    id: 2,
    name: "Tòa B - Khu đô thị Xanh",
    revenue: 2800000,
    occupancy: 88,
    rooms: 20,
    occupied: 18,
    status: "active",
    address: "456 Đường DEF, Quận 2, TP.HCM",
    monthlyGrowth: 3.8,
    avgRent: 780000,
  },
  {
    id: 3,
    name: "Tòa C - Khu đô thị Xanh",
    revenue: 2500000,
    occupancy: 85,
    rooms: 18,
    occupied: 15,
    status: "active",
    address: "789 Đường GHI, Quận 3, TP.HCM",
    monthlyGrowth: 2.1,
    avgRent: 720000,
  },
  {
    id: 4,
    name: "Tòa D - Khu đô thị Xanh",
    revenue: 2200000,
    occupancy: 78,
    rooms: 16,
    occupied: 12,
    status: "maintenance",
    address: "321 Đường JKL, Quận 4, TP.HCM",
    monthlyGrowth: -1.5,
    avgRent: 680000,
  },
  {
    id: 5,
    name: "Tòa E - Khu đô thị Xanh",
    revenue: 1800000,
    occupancy: 82,
    rooms: 14,
    occupied: 11,
    status: "active",
    address: "654 Đường MNO, Quận 5, TP.HCM",
    monthlyGrowth: 4.7,
    avgRent: 650000,
  },
];

const mockTenantData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    room: "A-101",
    building: "Tòa A",
    rent: 850000,
    status: "active",
    dueDate: "15/12/2024",
  },
  {
    id: 2,
    name: "Trần Thị B",
    room: "A-102",
    building: "Tòa A",
    rent: 900000,
    status: "overdue",
    dueDate: "05/12/2024",
  },
  {
    id: 3,
    name: "Lê Văn C",
    room: "B-201",
    building: "Tòa B",
    rent: 750000,
    status: "active",
    dueDate: "20/12/2024",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    room: "B-202",
    building: "Tòa B",
    rent: 800000,
    status: "overdue",
    dueDate: "10/12/2024",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    room: "C-301",
    building: "Tòa C",
    rent: 700000,
    status: "active",
    dueDate: "25/12/2024",
  },
];

const routes = [
  { key: "overview", title: "Tổng quan", icon: "📊" },
  { key: "buildings", title: "Tòa nhà", icon: "🏢" },
  { key: "tenants", title: "Người thuê", icon: "👥" },
  { key: "analytics", title: "Phân tích", icon: "📈" },
];

// Component cho tab Tổng quan
const OverviewTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const periodTabs = [
    { key: "week", title: "Tuần", icon: "📅" },
    { key: "month", title: "Tháng", icon: "📊" },
    { key: "quarter", title: "Quý", icon: "📈" },
    { key: "year", title: "Năm", icon: "🎯" },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Filter tabs */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Chọn khoảng thời gian
          </Text>
          <FilterTabs
            tabs={periodTabs}
            activeTab={selectedPeriod}
            onTabPress={setSelectedPeriod}
            variant="pill"
          />
        </View>

        {/* Thống kê tổng quan */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Thống kê tổng quan
          </Text>
          <View className="flex-row flex-wrap">
            <StatCard
              icon={<Text className="text-2xl">💰</Text>}
              label="Doanh thu tháng này"
              value={`${(mockRevenueData.currentMonth / 1000000).toFixed(1)}M`}
              bgColor={colors.primary.light}
            />
            <StatCard
              icon={<Text className="text-2xl">📈</Text>}
              label="Dự kiến tháng tới"
              value={`${(mockRevenueData.expectedNextMonth / 1000000).toFixed(1)}M`}
              bgColor={colors.status.success + "20"}
            />
            <StatCard
              icon={<Text className="text-2xl">🏢</Text>}
              label="Tỷ lệ lấp đầy"
              value={`${mockRevenueData.occupancyRate}%`}
              bgColor={colors.secondary.light}
            />
            <StatCard
              icon={<Text className="text-2xl">📊</Text>}
              label="Tổng doanh thu"
              value={`${(mockRevenueData.totalRevenue / 1000000).toFixed(0)}M`}
              bgColor={colors.status.info + "20"}
            />
          </View>
        </View>

        {/* Biểu đồ doanh thu nhanh */}
        <View className="mb-4">
          <EnhancedChart
            data={mockChartData}
            title="Xu hướng doanh thu 6 tháng gần đây"
            subtitle="Đơn vị: Triệu VNĐ"
            type="bar"
            height={180}
            showValues={true}
            showGrid={true}
          />
        </View>

        {/* Thông tin tòa nhà */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Thông tin tòa nhà
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Tổng số tòa nhà</Text>
              <Text className="text-lg font-bold text-primary-main">
                {mockRevenueData.totalBuildings}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Tổng số phòng</Text>
              <Text className="text-lg font-bold text-primary-main">
                {mockRevenueData.totalRooms}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Phòng đã thuê</Text>
              <Text className="text-lg font-bold text-status-success">
                {mockRevenueData.occupiedRooms}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Phòng trống</Text>
              <Text className="text-lg font-bold text-status-warning">
                {mockRevenueData.vacantRooms}
              </Text>
            </View>
          </View>
        </View>

        {/* Tỷ lệ lấp đầy chi tiết */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Tỷ lệ lấp đầy
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <ProgressBar
              percentage={mockRevenueData.occupancyRate}
              label="Tỷ lệ lấp đầy tổng thể"
              color={colors.primary.main}
            />
            <ProgressBar
              percentage={85}
              label="Tỷ lệ thanh toán đúng hạn"
              color={colors.status.success}
            />
            <ProgressBar
              percentage={92}
              label="Tỷ lệ gia hạn hợp đồng"
              color={colors.status.info}
            />
          </View>
        </View>

        {/* Cảnh báo và thông báo */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Cảnh báo & Thông báo
          </Text>
          <View className="bg-status-warning bg-opacity-10 rounded-lg p-3 border-l-4 border-status-warning mb-2">
            <Text className="font-semibold text-status-warning mb-1">
              ⚠️ Cần chú ý
            </Text>
            <Text className="text-gray-700 text-sm">
              Có 3 người thuê chưa thanh toán tiền phòng tháng này
            </Text>
          </View>
          <View className="bg-status-info bg-opacity-10 rounded-lg p-3 border-l-4 border-status-info">
            <Text className="font-semibold text-status-info mb-1">
              ℹ️ Thông báo
            </Text>
            <Text className="text-gray-700 text-sm">
              5 hợp đồng sẽ hết hạn trong tháng tới, cần liên hệ gia hạn
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Component cho tab Tòa nhà
const BuildingsTab = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterTabs = [
    { key: "all", title: "Tất cả", icon: "🏢" },
    { key: "active", title: "Hoạt động", icon: "✅" },
    { key: "maintenance", title: "Bảo trì", icon: "🔧" },
    { key: "inactive", title: "Không hoạt động", icon: "❌" },
  ];

  const filteredBuildings =
    selectedFilter === "all"
      ? mockBuildingData
      : mockBuildingData.filter(
          (building) => building.status === selectedFilter
        );

  const handleBuildingPress = (buildingId: number) => {
    console.log("Nhấn vào tòa nhà:", buildingId);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-3">
        <Text className="text-base font-semibold text-gray-800 mb-2">
          Lọc tòa nhà
        </Text>
        <FilterTabs
          tabs={filterTabs}
          activeTab={selectedFilter}
          onTabPress={setSelectedFilter}
          variant="default"
        />
      </View>

      <FlatList
        data={filteredBuildings}
        className="flex-1"
        contentContainerStyle={{ padding: 12, paddingTop: 0 }}
        renderItem={({ item }) => (
          <BuildingDetailCard
            building={item}
            onPress={() => handleBuildingPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <View className="mb-3">
            <Text className="text-base font-semibold text-gray-800 mb-2">
              Tổng quan tòa nhà
            </Text>
            <View className="bg-white rounded-lg p-3 shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600 text-sm">
                  Tổng doanh thu tất cả tòa nhà
                </Text>
                <Text className="text-base font-bold text-primary-main">
                  {(
                    filteredBuildings.reduce(
                      (sum, building) => sum + building.revenue,
                      0
                    ) / 1000000
                  ).toFixed(1)}
                  M
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600 text-sm">
                  Tỷ lệ lấp đầy trung bình
                </Text>
                <Text className="text-base font-bold text-status-success">
                  {(
                    filteredBuildings.reduce(
                      (sum, building) => sum + building.occupancy,
                      0
                    ) / filteredBuildings.length
                  ).toFixed(1)}
                  %
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-sm">
                  Tòa nhà đang hoạt động
                </Text>
                <Text className="text-base font-bold text-status-success">
                  {
                    filteredBuildings.filter(
                      (building) => building.status === "active"
                    ).length
                  }
                  /{filteredBuildings.length}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

// Component cho tab Người thuê
const TenantsTab = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");

  const statusTabs = [
    { key: "all", title: "Tất cả", icon: "👥" },
    { key: "active", title: "Đã thanh toán", icon: "✅" },
    { key: "overdue", title: "Chưa thanh toán", icon: "⚠️" },
  ];

  const filteredTenants =
    selectedStatus === "all"
      ? mockTenantData
      : mockTenantData.filter((tenant) => tenant.status === selectedStatus);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-3">
        <Text className="text-base font-semibold text-gray-800 mb-2">
          Lọc người thuê
        </Text>
        <FilterTabs
          tabs={statusTabs}
          activeTab={selectedStatus}
          onTabPress={setSelectedStatus}
          variant="pill"
        />
      </View>

      <FlatList
        data={filteredTenants}
        className="flex-1"
        contentContainerStyle={{ padding: 12, paddingTop: 0 }}
        renderItem={({ item }) => (
          <View className="bg-white rounded-lg p-3 mb-3 shadow-sm">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-base font-bold text-gray-800">
                {item.name}
              </Text>
              <View
                className={`px-2 py-1 rounded-full ${item.status === "active" ? "bg-status-success bg-opacity-20" : "bg-status-error bg-opacity-20"}`}
              >
                <Text
                  className={`text-xs font-medium ${item.status === "active" ? "text-status-success" : "text-status-error"}`}
                >
                  {item.status === "active"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600 text-sm">Phòng: {item.room}</Text>
              <Text className="text-gray-600 text-sm">
                Tòa: {item.building}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-base font-bold text-primary-main">
                {item.rent.toLocaleString()} VNĐ
              </Text>
              <Text className="text-gray-600 text-sm">Hạn: {item.dueDate}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

// Component cho tab Phân tích
const AnalyticsTab = () => {
  const [selectedChartType, setSelectedChartType] = useState("bar");

  const chartTypeTabs = [
    { key: "bar", title: "Cột", icon: "📊" },
    { key: "line", title: "Đường", icon: "📈" },
    { key: "area", title: "Vùng", icon: "📉" },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Chọn loại biểu đồ */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Chọn loại biểu đồ
          </Text>
          <FilterTabs
            tabs={chartTypeTabs}
            activeTab={selectedChartType}
            onTabPress={setSelectedChartType}
            variant="underline"
          />
        </View>

        {/* Biểu đồ doanh thu */}
        <View className="mb-4">
          <EnhancedChart
            data={mockChartData}
            title="Biểu đồ doanh thu 6 tháng gần đây"
            subtitle="Đơn vị: Triệu VNĐ"
            type={selectedChartType as "bar" | "line" | "area"}
            height={220}
            showValues={true}
            showGrid={true}
          />
        </View>

        {/* Phân tích chi tiết */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Phân tích chi tiết
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Tăng trưởng tháng này</Text>
              <Text className="text-lg font-bold text-status-success">
                +8.5%
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Tỷ lệ thu hồi nợ</Text>
              <Text className="text-lg font-bold text-status-success">96%</Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Chi phí vận hành</Text>
              <Text className="text-lg font-bold text-status-warning">
                2.1M
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Lợi nhuận ròng</Text>
              <Text className="text-lg font-bold text-status-success">
                10.4M
              </Text>
            </View>
          </View>
        </View>

        {/* Dự báo tương lai */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Dự báo tương lai
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Dự kiến tháng 1/2025</Text>
              <Text className="text-lg font-bold text-primary-main">14.2M</Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Dự kiến tháng 2/2025</Text>
              <Text className="text-lg font-bold text-primary-main">15.8M</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Dự kiến tháng 3/2025</Text>
              <Text className="text-lg font-bold text-primary-main">16.5M</Text>
            </View>
          </View>
        </View>

        {/* So sánh với tháng trước */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            So sánh với tháng trước
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Doanh thu</Text>
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-status-success mr-2">
                  +4.2%
                </Text>
                <Text className="text-sm text-gray-500">↑</Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">Số người thuê mới</Text>
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-status-success mr-2">
                  +3
                </Text>
                <Text className="text-sm text-gray-500">↑</Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Tỷ lệ lấp đầy</Text>
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-status-success mr-2">
                  +2.1%
                </Text>
                <Text className="text-sm text-gray-500">↑</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const renderScene = SceneMap({
  overview: OverviewTab,
  buildings: BuildingsTab,
  tenants: TenantsTab,
  analytics: AnalyticsTab,
});

const ReportScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.default }}
    >
      <StatusBar
        backgroundColor={colors.primary.main}
        barStyle="light-content"
      />
      <View>
        <HeaderComponents title="Báo cáo & Thống kê" />
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <CustomTabBar {...props} setIndex={setIndex} />
        )}
      />
    </SafeAreaView>
  );
};

export default ReportScreen;
