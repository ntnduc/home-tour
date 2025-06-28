import ProfileScreen from "@/screens/profile/ProfileScreen";
import RoomListScreen from "@/screens/tenant/RoomListScreen";
import TeantListScreen from "@/screens/tenant/TenantListScreen";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DashboardScreen from "../screens/common/DashboardScreen";

// Dummy screens cho các tab khác
const PropertiesScreen = () => (
  <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>Tài sản</Text>
);

const ReportsScreen = () => (
  <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>Báo cáo</Text>
);

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6a5af9",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          paddingBottom: 2 + insets.bottom,
          height: 40 + insets.bottom,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Trang chủ")
            return <Ionicons name="home-outline" size={size} color={color} />;
          if (route.name === "Tài sản")
            return <MaterialIcons name="apartment" size={size} color={color} />;
          if (route.name === "Phòng")
            return <FontAwesome5 name="door-open" size={size} color={color} />;
          if (route.name === "Báo cáo")
            return (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            );
          if (route.name === "Cá nhân")
            return (
              <Ionicons
                name="person-circle-outline"
                size={size}
                color={color}
              />
            );
          return null;
        },
      })}
    >
      <Tab.Screen name="Trang chủ" component={DashboardScreen} />
      <Tab.Screen name="Tài sản" component={TeantListScreen} />
      <Tab.Screen name="Phòng" component={RoomListScreen} />
      <Tab.Screen name="Báo cáo" component={ReportsScreen} />
      <Tab.Screen name="Cá nhân" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
