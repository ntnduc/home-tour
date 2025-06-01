import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  RoomDetail: { roomId: string };
  CreateTenant: undefined;
};

type RoomDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

// Mock data
const mockRoomDetail = {
  id: "1",
  title: "Phòng trọ cao cấp",
  address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
  price: "3.500.000",
  area: "25m²",
  description:
    "Phòng trọ cao cấp, đầy đủ tiện nghi, gần chợ, trường học, bệnh viện.",
  images: [
    "https://example.com/room1.jpg",
    "https://example.com/room2.jpg",
    "https://example.com/room3.jpg",
  ],
  facilities: [
    "Điều hòa",
    "Nóng lạnh",
    "Tủ lạnh",
    "Giường",
    "Tủ quần áo",
    "Wifi",
  ],
  owner: {
    name: "Nguyễn Văn A",
    phone: "0123456789",
  },
};

const { width } = Dimensions.get("window");

const RoomDetailScreen = ({ navigation }: RoomDetailScreenProps) => {
  return (
    <ScrollView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageContainer}
      >
        {mockRoomDetail.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.image}
            defaultSource={require("../../../assets/icon.png")}
          />
        ))}
      </ScrollView>

      <View style={styles.content}>
        <Text style={styles.title}>{mockRoomDetail.title}</Text>
        <Text style={styles.address}>{mockRoomDetail.address}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{mockRoomDetail.price}đ/tháng</Text>
          <Text style={styles.area}>{mockRoomDetail.area}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{mockRoomDetail.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiện nghi</Text>
          <View style={styles.facilitiesContainer}>
            {mockRoomDetail.facilities.map((facility, index) => (
              <View key={index} style={styles.facilityItem}>
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin chủ trọ</Text>
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{mockRoomDetail.owner.name}</Text>
            <Text style={styles.ownerPhone}>{mockRoomDetail.owner.phone}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            // TODO: Implement contact functionality
          }}
        >
          <Text style={styles.contactButtonText}>Liên hệ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rentButton}
          onPress={() => {
            navigation.navigate("CreateTenant");
          }}
        >
          <Text style={styles.rentButtonText}>Thêm tài sản</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    height: 300,
  },
  image: {
    width: width,
    height: 300,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  area: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  facilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  facilityItem: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 14,
    color: "#333",
  },
  ownerInfo: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ownerPhone: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  rentButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  rentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RoomDetailScreen;
