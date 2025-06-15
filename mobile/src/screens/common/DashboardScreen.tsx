import { RootStackParamList } from "@/navigation";
import { colors } from "@/theme/colors";
import { User } from "@/types/user";
import { getStoreUser } from "@/utils/appUtil";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import QuickActionButton from "../../components/QuickActionButton";
import StatCard from "../../components/StatCard";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DashboardScreen = () => {
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const navigation = useNavigation<NavigationProp>();

  React.useEffect(() => {
    const loadUser = async () => {
      const userData = await getStoreUser();
      setUser(userData);
    };
    loadUser();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trang chủ</Text>
          <Text style={styles.subtitle}>Xin chào, {user?.name}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon={<Ionicons name="business" size={28} color="#6a5af9" />}
            label="Tài sản"
            value={0}
            bgColor="#eef1fd"
          />
          <StatCard
            icon={
              <MaterialIcons name="meeting-room" size={28} color="#00c2ff" />
            }
            label="Tổng phòng"
            value={0}
            bgColor="#e6f9f3"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            icon={
              <FontAwesome5 name="user-friends" size={28} color="#ff4d6d" />
            }
            label="Đã thuê"
            value={0}
            bgColor="#fff3f0"
          />
          <StatCard
            icon={<Ionicons name="cash" size={28} color="#00c2ff" />}
            label="Tháng này"
            value="0₫"
            bgColor="#fbefff"
          />
        </View>

        {/* Quick Actions */}
        <Text style={styles.quickActionTitle}>Thao tác nhanh</Text>
        <View style={styles.quickActionsRow}>
          <QuickActionButton
            label="Thêm tài sản"
            icon={<Ionicons name="add" size={24} color="#fff" />}
            onPress={() => {
              navigation.navigate("CreateTenant");
            }}
            styleLabel={{ color: colors.text.inverse }}
            gradient
          />
          <QuickActionButton
            label="Thêm người thuê"
            icon={<FontAwesome5 name="user-plus" size={24} color="#6a5af9" />}
            onPress={() => {}}
          />
        </View>

        {/* Recent Activity */}
        <Text style={styles.recentTitle}>Hoạt động gần đây</Text>
        <View style={styles.recentBox}>
          <Text style={{ color: "#888" }}>Chưa có hoạt động nào.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#888", marginTop: 4 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  quickActionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  quickActionsRow: { flexDirection: "row", justifyContent: "space-between" },
  recentTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  recentBox: {
    backgroundColor: "#f5f6fa",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
});

export default DashboardScreen;
