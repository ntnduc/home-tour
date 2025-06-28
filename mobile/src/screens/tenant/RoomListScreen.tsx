import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  RoomList: undefined;
  RoomDetail: { roomId: number };
};

type RoomListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

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

  const filteredRooms = mockRoomList.filter(
    (room) =>
      room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.building.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setVisibleCount(5);
  }, [search]);

  const renderRoomCard = ({ item }: { item: any }) => {
    const status = statusColor[item.status as keyof typeof statusColor] || {
      bg: "#EAF4FF",
      color: "#007AFF",
    };
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
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={filteredRooms.slice(0, visibleCount)}
        renderItem={renderRoomCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Danh Sách Phòng</Text>
            </View>
            <View style={styles.searchBarWrapper}>
              <Ionicons
                name="search"
                size={20}
                color="#888"
                style={{ marginLeft: 10 }}
              />
              <TextInput
                style={styles.searchBar}
                placeholder="Tìm kiếm phòng hoặc tòa nhà..."
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="#aaa"
              />
              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearch("")}
                  style={{ padding: 6 }}
                >
                  <Ionicons name="close-circle" size={18} color="#bbb" />
                </TouchableOpacity>
              )}
            </View>
          </>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: "#888" }}>Không tìm thấy phòng phù hợp.</Text>
          </View>
        }
        onEndReached={() => {
          if (visibleCount < filteredRooms.length) {
            setVisibleCount((prev) => Math.min(prev + 5, filteredRooms.length));
          }
        }}
        onEndReachedThreshold={0.2}
      />
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
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginTop: 8,
    marginBottom: 8,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FB",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  searchBar: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: "#222",
    backgroundColor: "transparent",
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
});

export default RoomListScreen;
