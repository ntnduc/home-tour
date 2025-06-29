import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContractListScreen from "../screens/contract/ContractListScreen";
import DashboardScreen from "../screens/dasboard/DashboardScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ReportScreen from "../screens/report/ReportScreen";
import RoomListScreen from "../screens/tenant/RoomListScreen";
import TeantListScreen from "../screens/tenant/TenantListScreen";

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
          if (route.name === "Hợp đồng")
            return (
              <Ionicons
                name="document-text-outline"
                size={size}
                color={color}
              />
            );
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
      <Tab.Screen name="Hợp đồng" component={ContractListScreen} />
      <Tab.Screen name="Báo cáo" component={ReportScreen} />
      <Tab.Screen name="Cá nhân" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
