import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContractListScreen from "../screens/contract/ContractListScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import PropertyListScreen from "../screens/property/PropertyListScreen";
import ReportScreen from "../screens/report/ReportScreen";
import RoomListScreen from "../screens/room/RoomListScreen";
import { TabParamList } from "./types";

const Tab = createBottomTabNavigator<TabParamList>();

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
          switch (route.name) {
            case "Dashboard":
              return <Ionicons name="home-outline" size={size} color={color} />;
            case "Properties":
              return (
                <MaterialIcons name="apartment" size={size} color={color} />
              );
            case "Rooms":
              return (
                <FontAwesome5 name="door-open" size={size} color={color} />
              );
            case "Contracts":
              return (
                <Ionicons
                  name="document-text-outline"
                  size={size}
                  color={color}
                />
              );
            case "Reports":
              return (
                <Ionicons name="bar-chart-outline" size={size} color={color} />
              );
            case "Profile":
              return (
                <Ionicons
                  name="person-circle-outline"
                  size={size}
                  color={color}
                />
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Trang chủ" }}
      />
      <Tab.Screen
        name="Properties"
        component={PropertyListScreen}
        options={{ title: "Tài sản" }}
      />
      <Tab.Screen
        name="Rooms"
        component={RoomListScreen}
        options={{ title: "Phòng" }}
      />
      <Tab.Screen
        name="Contracts"
        component={ContractListScreen}
        options={{ title: "Hợp đồng" }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportScreen}
        options={{ title: "Báo cáo" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Cá nhân" }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
