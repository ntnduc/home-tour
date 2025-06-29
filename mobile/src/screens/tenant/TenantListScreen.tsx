import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";
import HeaderComponents from "../common/HeaderComponents";

type RootStackParamList = {
  RoomDetail: { roomId: string };
  EditBuilding: { buildingId: string };
  AddRoom: { buildingId: string };
  RoomList: { buildingId?: string };
};

type RoomListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

interface Room {
  id: string;
  title: string;
  address: string;
  price: string;
  area: string;
  images: string[];
}

interface Building {
  id: string;
  name: string;
  address: string;
  description: string;
  floors: number;
  rooms: number;
  tenants: number;
  amenities: string[];
}

const mockBuildings: Building[] = [
  {
    id: "1",
    name: "Tòa nhà Sunrise",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    description: "Tòa nhà cao cấp trong trung tâm thành phố.",
    floors: 10,
    rooms: 50,
    tenants: 38,
    amenities: ["Thang máy", "Bảo vệ 24/7", "Parking"],
  },
  {
    id: "2",
    name: "Tòa nhà Sunset",
    address: "456 Lê Lợi, Quận 3, TP.HCM",
    description: "Gần công viên, nhiều tiện ích.",
    floors: 8,
    rooms: 40,
    tenants: 40,
    amenities: ["Thang máy", "Gym", "Hồ bơi"],
  },
  {
    id: "3",
    name: "Tòa nhà GreenView",
    address: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
    description: "Không gian xanh, yên tĩnh.",
    floors: 6,
    rooms: 30,
    tenants: 15,
    amenities: ["Sân vườn", "Bảo vệ 24/7"],
  },
  {
    id: "4",
    name: "Tòa nhà RiverSide",
    address: "12 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    description: "View sông, thoáng mát.",
    floors: 12,
    rooms: 60,
    tenants: 60,
    amenities: ["Thang máy", "Hồ bơi", "Parking"],
  },
  {
    id: "5",
    name: "Tòa nhà CityLight",
    address: "34 Lý Tự Trọng, Quận 1, TP.HCM",
    description: "Ngay trung tâm, tiện đi lại.",
    floors: 7,
    rooms: 28,
    tenants: 20,
    amenities: ["Thang máy", "Gym"],
  },
  {
    id: "6",
    name: "Tòa nhà SkyHome",
    address: "56 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    description: "Tòa nhà mới, hiện đại.",
    floors: 9,
    rooms: 36,
    tenants: 10,
    amenities: ["Thang máy", "Bảo vệ 24/7"],
  },
  {
    id: "7",
    name: "Tòa nhà OceanView",
    address: "88 Võ Văn Kiệt, Quận 1, TP.HCM",
    description: "View biển, không gian mở.",
    floors: 15,
    rooms: 80,
    tenants: 75,
    amenities: ["Thang máy", "Hồ bơi", "Parking"],
  },
  {
    id: "8",
    name: "Tòa nhà Lotus",
    address: "99 Nguyễn Đình Chiểu, Quận 3, TP.HCM",
    description: "Thiết kế sang trọng, nhiều tiện ích.",
    floors: 11,
    rooms: 44,
    tenants: 44,
    amenities: ["Thang máy", "Gym", "Bảo vệ 24/7"],
  },
  {
    id: "9",
    name: "Tòa nhà Pearl",
    address: "22 Lê Lai, Quận 1, TP.HCM",
    description: "Gần chợ Bến Thành.",
    floors: 5,
    rooms: 20,
    tenants: 10,
    amenities: ["Thang máy", "Parking"],
  },
  {
    id: "10",
    name: "Tòa nhà Ruby",
    address: "77 Nguyễn Trãi, Quận 5, TP.HCM",
    description: "Tòa nhà nhỏ, yên tĩnh.",
    floors: 4,
    rooms: 16,
    tenants: 8,
    amenities: ["Bảo vệ 24/7"],
  },
];

const totalBuildings = mockBuildings.length;
const totalRooms = mockBuildings.reduce((sum, b) => sum + b.rooms, 0);
const totalTenants = mockBuildings.reduce((sum, b) => sum + b.tenants, 0);
const allAmenities = mockBuildings.flatMap((b) => b.amenities);
const totalAmenities = new Set(allAmenities).size;
const avgOccupancy =
  totalRooms > 0 ? Math.round((totalTenants / totalRooms) * 100) : 0;

const getStatusInfo = (building: Building) => {
  if (building.tenants === building.rooms) {
    return {
      label: "Đầy phòng",
      color: colors.status.success,
      bg: colors.status.success + "20",
    };
  } else if (building.tenants === 0) {
    return {
      label: "Trống",
      color: colors.status.warning,
      bg: colors.status.warning + "20",
    };
  } else {
    return {
      label: "Còn phòng",
      color: colors.status.error,
      bg: colors.status.error + "20",
    };
  }
};

const TenantListScreen = ({ navigation }: RoomListScreenProps) => {
  const [search, setSearch] = useState("");
  const filteredBuildings = mockBuildings.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const renderBuildingCard = ({ item }: { item: Building }) => {
    const occupancyRate = Math.round((item.tenants / item.rooms) * 100);
    const status = getStatusInfo(item);

    return (
      <View style={styles.buildingCard}>
        <View style={styles.cardHeader}>
          <View style={styles.buildingInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.buildingName}>{item.name}</Text>
              <View
                style={[styles.statusBadge, { backgroundColor: status.bg }]}
              >
                <Text style={[styles.statusText, { color: status.color }]}>
                  {status.label}
                </Text>
              </View>
            </View>
            <Text style={styles.buildingAddress}>{item.address}</Text>
          </View>
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() =>
              navigation.navigate("EditBuilding", { buildingId: item.id })
            }
          >
            <Ionicons name="pencil" size={18} color={colors.primary.main} />
          </TouchableOpacity>
        </View>

        <Text style={styles.buildingDesc}>{item.description}</Text>

        <View style={styles.basicInfoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🏢</Text>
            <Text style={styles.infoLabel}>{item.floors} tầng</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🔑</Text>
            <Text style={styles.infoLabel}>{item.rooms} phòng</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>👤</Text>
            <Text style={styles.infoLabel}>{item.tenants} thuê</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Tỷ lệ lấp đầy</Text>
            <Text style={styles.progressPercent}>{occupancyRate}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${occupancyRate}%`,
                  backgroundColor:
                    occupancyRate === 100
                      ? colors.status.success
                      : colors.status.error,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.status.success + "10",
                borderColor: colors.status.success + "30",
              },
            ]}
            onPress={() =>
              navigation.navigate("AddRoom", { buildingId: item.id })
            }
          >
            <Ionicons name="add" size={16} color={colors.status.success} />
            <Text
              style={[styles.actionBtnText, { color: colors.status.success }]}
            >
              Thêm phòng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.primary.light,
                borderColor: colors.primary.main + "30",
              },
            ]}
            onPress={() =>
              navigation.navigate("RoomList", { buildingId: item.id })
            }
          >
            <Ionicons name="home" size={16} color={colors.primary.main} />
            <Text
              style={[styles.actionBtnText, { color: colors.primary.main }]}
            >
              Xem phòng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
      <FlatList
        data={filteredBuildings}
        renderItem={renderBuildingCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <HeaderComponents
            title="Quản lý tòa nhà"
            isSearch
            searchConfig={{
              placeholder: "Tìm kiếm tòa nhà...",
              onSearch: handleSearch,
              className: "mx-2",
            }}
          >
            <View style={styles.statsRow}>
              <View
                style={[
                  styles.statsBox,
                  { backgroundColor: colors.primary.light },
                ]}
              >
                <Text style={styles.statsIcon}>🏢</Text>
                <Text style={styles.statsValue}>{totalBuildings}</Text>
                <Text style={styles.statsLabel}>Tòa nhà</Text>
              </View>
              <View
                style={[
                  styles.statsBox,
                  { backgroundColor: colors.status.success + "20" },
                ]}
              >
                <Text style={styles.statsIcon}>🔑</Text>
                <Text style={styles.statsValue}>{totalRooms}</Text>
                <Text style={styles.statsLabel}>Phòng</Text>
              </View>
              <View
                style={[
                  styles.statsBox,
                  { backgroundColor: colors.status.warning + "20" },
                ]}
              >
                <Text style={styles.statsIcon}>👤</Text>
                <Text style={styles.statsValue}>{totalTenants}</Text>
                <Text style={styles.statsLabel}>Đã thuê</Text>
              </View>
            </View>
          </HeaderComponents>
        }
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: colors.text.secondary }}>
              Không tìm thấy tòa nhà phù hợp.
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          /* Xử lý tạo tòa nhà */
        }}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buildingCard: {
    backgroundColor: colors.background.default,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginHorizontal: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  buildingInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  buildingName: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.text.primary,
    flex: 1,
  },
  buildingAddress: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  buildingDesc: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 6,
    fontStyle: "italic",
  },
  basicInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 13,
    color: colors.text.secondary,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  progressSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  progressLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  progressBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: colors.border.light,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "600",
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  statsBox: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: colors.background.paper,
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statsIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  statsValue: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.primary.main,
  },
  statsLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
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
  fabIcon: {
    color: colors.neutral.white,
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2,
  },
  updateBtn: {
    backgroundColor: colors.background.paper,
    borderRadius: 8,
    padding: 7,
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  statusRow: {
    marginTop: 8,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default TenantListScreen;
