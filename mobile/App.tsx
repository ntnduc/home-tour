import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { TamaguiProvider } from "tamagui";
import "./global.css";

// Navigation
import TabNavigator from "./src/navigation/TabNavigator";
import { RootStackParamList } from "./src/navigation/types";

// Auth Screens
import LoginScreen from "./src/screens/auth/LoginScreen";
import OTPVerificationScreen from "./src/screens/auth/OTPVerificationScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";

// Property Screens
import CreatePropertyScreen from "./src/screens/property/CreatePropertyScreen";
import PropertyDetailScreen from "./src/screens/property/PropertyDetailScreen";
import PropertyListScreen from "./src/screens/property/PropertyListScreen";
import UpdatePropertyScreen from "./src/screens/property/UpdatePropertyScreen";

// Room Screens
import CreateRoomScreen from "./src/screens/room/CreateRoomScreen";
import RoomDetailScreen from "./src/screens/room/RoomDetailScreen";
import RoomListScreen from "./src/screens/room/RoomListScreen";
import UpdateRoomScreen from "./src/screens/room/UpdateRoomScreen";

// Tenant Screens
import CreateTenantScreen from "./src/screens/tenant/CreateTenantScreen";
import TenantDetailScreen from "./src/screens/tenant/TenantDetailScreen";
import TenantListScreen from "./src/screens/tenant/TenantListScreen";
import UpdateTenantScreen from "./src/screens/tenant/UpdateTenantScreen";

// Contract Screens
import ContractDetailScreen from "./src/screens/contract/ContractDetailScreen";
import ContractListScreen from "./src/screens/contract/ContractListScreen";
import CreateContractScreen from "./src/screens/contract/CreateContractScreen";
import TerminateContractScreen from "./src/screens/contract/TerminateContractScreen";

// Invoice Screens
import CreateInvoiceScreen from "./src/screens/invoice/CreateInvoiceScreen";
import InvoiceDetailScreen from "./src/screens/invoice/InvoiceDetailScreen";
import InvoiceHistoryScreen from "./src/screens/invoice/InvoiceHistoryScreen";

// Config
import config from "./tamagui.config";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const queryClient = new QueryClient();

  // Polyfill for web compatibility
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                gestureEnabled: true,
                animation: "slide_from_right",
                headerBackTitle: "Trở lại",
              }}
            >
              {/* Auth Flow */}
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

              {/* Main App */}
              <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />

              {/* Property Management */}
              <Stack.Screen
                name="PropertyList"
                component={PropertyListScreen}
                options={{ title: "Danh Sách Tài Sản" }}
              />
              <Stack.Screen
                name="PropertyDetail"
                component={PropertyDetailScreen}
                options={{ title: "Chi Tiết Tài Sản" }}
              />
              <Stack.Screen
                name="CreateProperty"
                component={CreatePropertyScreen}
                options={{ title: "Tạo Tài Sản Mới" }}
              />
              <Stack.Screen
                name="UpdateProperty"
                component={UpdatePropertyScreen}
                options={{ title: "Cập Nhật Tài Sản" }}
              />

              {/* Room Management */}
              <Stack.Screen
                name="RoomList"
                component={RoomListScreen}
                options={{ title: "Danh Sách Phòng" }}
              />
              <Stack.Screen
                name="RoomDetail"
                component={RoomDetailScreen}
                options={{ title: "Chi Tiết Phòng" }}
              />
              <Stack.Screen
                name="CreateRoom"
                component={CreateRoomScreen}
                options={{ title: "Tạo Phòng Mới" }}
              />
              <Stack.Screen
                name="UpdateRoom"
                component={UpdateRoomScreen}
                options={{ title: "Cập Nhật Phòng" }}
              />

              {/* Tenant Management */}
              <Stack.Screen
                name="TenantList"
                component={TenantListScreen}
                options={{ title: "Danh Sách Khách Thuê" }}
              />
              <Stack.Screen
                name="TenantDetail"
                component={TenantDetailScreen}
                options={{ title: "Chi Tiết Khách Thuê" }}
              />
              <Stack.Screen
                name="CreateTenant"
                component={CreateTenantScreen}
                options={{ title: "Tạo Khách Thuê Mới" }}
              />
              <Stack.Screen
                name="UpdateTenant"
                component={UpdateTenantScreen}
                options={{ title: "Cập Nhật Khách Thuê" }}
              />

              {/* Contract Management */}
              <Stack.Screen
                name="ContractList"
                component={ContractListScreen}
                options={{ title: "Danh Sách Hợp Đồng" }}
              />
              <Stack.Screen
                name="ContractDetail"
                component={ContractDetailScreen}
                options={{ title: "Chi Tiết Hợp Đồng" }}
              />
              <Stack.Screen
                name="CreateContract"
                component={CreateContractScreen}
                options={{ title: "Tạo Hợp Đồng Mới" }}
              />
              <Stack.Screen
                name="TerminateContract"
                component={TerminateContractScreen}
                options={{ title: "Chấm Dứt Hợp Đồng" }}
              />

              {/* Invoice Management */}
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
                        // TODO: Implement filter modal
                        console.log("Open filter modal");
                      }}
                    >
                      <Ionicons name="filter" size={24} color="#007AFF" />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="CreateInvoice"
                component={CreateInvoiceScreen}
                options={{ title: "Tạo Hóa Đơn Mới" }}
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
