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
    return { label: "Đầy phòng", color: "#FF3B30", bg: "#FFECEC" };
  } else if (building.tenants === 0) {
    return { label: "Trống", color: "#FF9500", bg: "#FFF6E5" };
  } else {
    return { label: "Còn phòng", color: "#34C759", bg: "#E9F9EF" };
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.buildingName}>{item.name}</Text>
            <Text style={styles.buildingAddress}>{item.address}</Text>
            <Text style={styles.buildingDesc}>{item.description}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>🏢 {item.floors} tầng</Text>
              <Text style={styles.infoText}>🔑 {item.rooms} phòng</Text>
              <Text style={styles.infoText}>👤 {item.tenants} thuê</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${occupancyRate}%`,
                    backgroundColor:
                      occupancyRate === 100 ? "#FF3B30" : "#34C759",
                  },
                ]}
              />
            </View>
            <Text style={styles.progressPercent}>{occupancyRate}% lấp đầy</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  navigation.navigate("EditBuilding", { buildingId: item.id })
                }
              >
                <Ionicons name="pencil" size={18} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  navigation.navigate("AddRoom", { buildingId: item.id })
                }
              >
                <Ionicons name="add" size={20} color="#34C759" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: "#FFF6E5" }]}
                onPress={() =>
                  navigation.navigate("RoomList", { buildingId: item.id })
                }
              >
                <Ionicons name="home" size={18} color="#FF9500" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
            }}
          >
            <View style={styles.statsRow}>
              <View style={[styles.statsBox, { backgroundColor: "#F0F8FF" }]}>
                <Text style={styles.statsIcon}>🏢</Text>
                <Text style={styles.statsValue}>{totalBuildings}</Text>
                <Text style={styles.statsLabel}>Tòa nhà</Text>
              </View>
              <View style={[styles.statsBox, { backgroundColor: "#F8FFF0" }]}>
                <Text style={styles.statsIcon}>🔑</Text>
                <Text style={styles.statsValue}>{totalRooms}</Text>
                <Text style={styles.statsLabel}>Phòng</Text>
              </View>
              <View style={[styles.statsBox, { backgroundColor: "#FFF8F0" }]}>
                <Text style={styles.statsIcon}>👤</Text>
                <Text style={styles.statsValue}>{totalTenants}</Text>
                <Text style={styles.statsLabel}>Đã thuê</Text>
              </View>
            </View>
          </HeaderComponents>
        }
        contentContainerStyle={{ margin: 8, marginTop: 0 }}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: "#888" }}>
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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  roomCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  roomInfo: {
    padding: 16,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  roomAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  roomDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  roomArea: {
    fontSize: 14,
    color: "#666",
  },
  buildingCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  buildingName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  buildingAddress: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
  buildingDesc: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
    fontStyle: "italic",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 12,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginRight: 8,
  },
  progressBarBg: {
    width: "100%",
    height: 5,
    backgroundColor: "#F2F2F2",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 2,
  },
  progressBarFill: {
    height: 5,
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 13,
    color: "#34C759",
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 2,
  },
  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: 12,
    marginTop: 2,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 24,
    paddingBottom: 8,
    paddingHorizontal: 0,
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
    backgroundColor: "#F4F6FB",
    shadowColor: "#000",
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
    color: "#007AFF",
  },
  statsLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
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
  fabIcon: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2,
  },
  iconBtn: {
    backgroundColor: "#F4F6FB",
    borderRadius: 8,
    padding: 7,
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TenantListScreen;
