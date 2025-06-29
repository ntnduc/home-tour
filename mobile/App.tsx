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
import RoomDetailScreen from "./src/screens/tenant/RoomListScreen";
import RoomListScreen from "./src/screens/tenant/TenantListScreen";
import UpdateRoomScreen from "./src/screens/tenant/UpdateRoomScreen";
import config from "./tamagui.config";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
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
              options={{ title: "Danh sách phòng trọ" }}
            />
            <Stack.Screen
              name="RoomDetail"
              component={RoomDetailScreen}
              options={{ title: "Chi tiết phòng trọ" }}
            />
            <Stack.Screen
              name="CreateTenant"
              component={CreateTenantScreen}
              options={{ title: "Tạo thông tin thuê phòng" }}
            />
            <Stack.Screen
              name="UpdateRoom"
              component={UpdateRoomScreen}
              options={{ title: "Cập nhật phòng" }}
            />
            <Stack.Screen
              name="InvoiceDetail"
              component={InvoiceDetailScreen}
              options={({ navigation, route }) => {
                // Kiểm tra xem có phải từ màn hình lịch sử không
                const isFromHistory = route.params?.fromHistory;

                return {
                  title: "Chi tiết hóa đơn",
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
                title: "Lịch sử hóa đơn",
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
              options={{ title: "Tạo hợp đồng" }}
            />
            <Stack.Screen
              name="ContractDetail"
              component={ContractDetailScreen}
              options={{ title: "Chi tiết hợp đồng" }}
            />
            <Stack.Screen
              name="TerminateContract"
              component={TerminateContractScreen}
              options={{ title: "Hủy hợp đồng" }}
            />
            <Stack.Screen
              name="ContractList"
              component={ContractListScreen}
              options={{ title: "Danh sách hợp đồng" }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
        <Toast />
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
