import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  RoomDetail: { roomId: string };
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

// Mock data
const mockRooms: Room[] = [
  {
    id: "1",
    title: "Phòng trọ cao cấp",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    price: "3.500.000",
    area: "25m²",
    images: ["https://example.com/room1.jpg"],
  },
  {
    id: "2",
    title: "Phòng trọ tiện nghi",
    address: "456 Lê Văn Việt, Quận 9, TP.HCM",
    price: "2.800.000",
    area: "20m²",
    images: ["https://example.com/room2.jpg"],
  },
];

const RoomListScreen = ({ navigation }: RoomListScreenProps) => {
  const renderRoomItem = ({ item }: { item: Room }) => (
    <TouchableOpacity
      style={styles.roomCard}
      onPress={() => navigation.navigate("RoomDetail", { roomId: item.id })}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.roomImage}
        defaultSource={require("../../../assets/icon.png")}
      />
      <View style={styles.roomInfo}>
        <Text style={styles.roomTitle}>{item.title}</Text>
        <Text style={styles.roomAddress}>{item.address}</Text>
        <View style={styles.roomDetails}>
          <Text style={styles.roomPrice}>{item.price}đ/tháng</Text>
          <Text style={styles.roomArea}>{item.area}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockRooms}
        renderItem={renderRoomItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
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
});

export default RoomListScreen;
