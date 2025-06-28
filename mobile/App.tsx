import CreateTenantScreen from "@/screens/tenant/CreateTenantScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";

import Toast from "react-native-toast-message";
import { TamaguiProvider } from "tamagui";
import { RootStackParamList } from "./src/navigation/index";
import TabNavigator from "./src/navigation/TabNavigator";
import LoginScreen from "./src/screens/auth/LoginScreen";
import OTPVerificationScreen from "./src/screens/auth/OTPVerificationScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import RoomDetailScreen from "./src/screens/tenant/RoomListScreen";
import RoomListScreen from "./src/screens/tenant/TenantListScreen";
import config from "./tamagui.config";

import "./global.css";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
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
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
      <Toast />
    </TamaguiProvider>
  );
}
