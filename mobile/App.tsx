import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import CreateTenantScreen from "./src/screens/tenant/CreateTenantScreen";

import Toast from "react-native-toast-message";
import { TamaguiProvider } from "tamagui";
import { RootStackParamList } from "./src/navigation/index";
import TabNavigator from "./src/navigation/TabNavigator";
import LoginScreen from "./src/screens/auth/LoginScreen";
import OTPVerificationScreen from "./src/screens/auth/OTPVerificationScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import UpdateRoomScreen from "./src/screens/room/UpdateRoomScreen";
import RoomListScreen from "./src/screens/tenant/TenantListScreen";
import config from "./tamagui.config";

import RoomDetailScreen from "@/screens/room/RoomDetailScreen";
import UpdateTenantScreen from "@/screens/tenant/UpdateTenantScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";
import ContractDetailScreen from "./src/screens/contract/ContractDetailScreen";
import ContractListScreen from "./src/screens/contract/ContractListScreen";
import CreateContractScreen from "./src/screens/contract/CreateContractScreen";
import InvoiceDetailScreen from "./src/screens/invoice/InvoiceDetailScreen";
import InvoiceHistoryScreen from "./src/screens/invoice/InvoiceHistoryScreen";
import TerminateContractScreen from "./src/screens/tenant/TerminateContractScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const queryClient = new QueryClient();

  if (typeof window !== "undefined" && !window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      media: "",
      onchange: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });
  }

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                gestureEnabled: true,
                animation: "slide_from_right",
                title: "Trở lại",
              }}
            >
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="OTPVerification"
                component={OTPVerificationScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="RoomList"
                component={RoomListScreen}
                options={{ title: "Danh Sách Phòng" }}
              />
              <Stack.Screen
                name="RoomDetail"
                component={RoomDetailScreen}
                options={{ title: "Chi Tiết Căn Hộ" }}
              />
              <Stack.Screen
                name="CreateTenant"
                component={CreateTenantScreen}
                options={{ title: "Tạo Căn Hộ" }}
              />
              <Stack.Screen
                name="UpdateRoom"
                component={UpdateRoomScreen}
                options={{ title: "Cập Nhật Phòng" }}
              />
              <Stack.Screen
                name="InvoiceDetail"
                component={InvoiceDetailScreen}
                options={({ navigation, route }) => {
                  const isFromHistory = route.params?.fromHistory;

                  return {
                    title: "Chi Tiết Hóa Đơn",
                    headerRight: () =>
                      !isFromHistory ? (
                        <TouchableOpacity
                          style={{ marginRight: 16 }}
                          onPress={() => navigation.navigate("InvoiceHistory")}
                        >
                          <Ionicons
                            name="time-outline"
                            size={24}
                            color="#007AFF"
                          />
                        </TouchableOpacity>
                      ) : null,
                  };
                }}
              />
              <Stack.Screen
                name="InvoiceHistory"
                component={InvoiceHistoryScreen}
                options={({ navigation }) => ({
                  title: "Lịch Sử Hóa Đơn",
                  headerRight: () => (
                    <TouchableOpacity
                      style={{ marginRight: 16 }}
                      onPress={() => {
                        // TODO: Mở modal filter
                        console.log("Open filter modal");
                      }}
                    >
                      <Ionicons name="filter" size={24} color="#007AFF" />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="CreateContract"
                component={CreateContractScreen}
                options={{ title: "Tạo Hợp Đồng" }}
              />
              <Stack.Screen
                name="ContractDetail"
                component={ContractDetailScreen}
                options={{ title: "Chi Tiết Hợp Đồng" }}
              />
              <Stack.Screen
                name="TerminateContract"
                component={TerminateContractScreen}
                options={{ title: "Hủy Hợp Đồng" }}
              />
              <Stack.Screen
                name="ContractList"
                component={ContractListScreen}
                options={{ title: "Danh Sách Hợp Đồng" }}
              />
              <Stack.Screen
                name="UpdateTenant"
                component={UpdateTenantScreen}
                options={{
                  title: "Cập Nhật Căn Hộ",
                }}
              />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
          <Toast />
        </TamaguiProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
