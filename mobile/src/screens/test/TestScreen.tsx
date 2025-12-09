import { RootStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

type TestScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "TestScreen">;
};

const TestScreen = ({ navigation }: TestScreenProps) => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Test Invoice Screens
        </Text>

        {/* Main Test Buttons */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-4">
            Test Views
          </Text>
          
          {/* Button 1: View Invoice Detail */}
          <TouchableOpacity
            className="bg-blue-600 rounded-xl p-6 mb-4 flex-row items-center justify-between shadow-sm"
            onPress={() =>
              navigation.navigate("InvoiceDetail", {
                invoiceId: "inv-1", // Chưa thanh toán - có thể test thanh toán
              })
            }
          >
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Ionicons name="receipt-outline" size={24} color="#FFFFFF" />
                <Text className="text-xl font-bold text-white ml-3">
                  Xem Chi Tiết Hóa Đơn
                </Text>
              </View>
              <Text className="text-sm text-blue-100 mt-1">
                Xem view chi tiết hóa đơn và test thanh toán
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Button 2: Create Invoice */}
          <TouchableOpacity
            className="bg-green-600 rounded-xl p-6 mb-4 flex-row items-center justify-between shadow-sm"
            onPress={() =>
              navigation.navigate("CreateInvoice", {
                contractId: "contract-1",
              })
            }
          >
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                <Text className="text-xl font-bold text-white ml-3">
                  Tạo Hóa Đơn Mới
                </Text>
              </View>
              <Text className="text-sm text-green-100 mt-1">
                Xem view tạo hóa đơn với form đầy đủ
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Additional Test Options */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-3">
            Test Cases Khác
          </Text>
          
          {/* Invoice Detail - Paid */}
          <TouchableOpacity
            className="bg-white rounded-xl p-4 mb-2 flex-row items-center justify-between border border-gray-200"
            onPress={() =>
              navigation.navigate("InvoiceDetail", {
                invoiceId: "inv-2", // Đã thanh toán
              })
            }
          >
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Hóa đơn đã thanh toán
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                ID: inv-2 - Có lịch sử thanh toán
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Create Invoice with Room ID */}
          <TouchableOpacity
            className="bg-white rounded-xl p-4 mb-2 flex-row items-center justify-between border border-gray-200"
            onPress={() =>
              navigation.navigate("CreateInvoice", {
                roomId: "room-1",
              })
            }
          >
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Tạo hóa đơn với Room ID
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                room-1 - Sẽ load contracts của room
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Invoice History */}
          <TouchableOpacity
            className="bg-white rounded-xl p-4 flex-row items-center justify-between border border-gray-200"
            onPress={() => navigation.navigate("InvoiceHistory")}
          >
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Lịch sử hóa đơn
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Danh sách tất cả hóa đơn
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <View className="flex-row items-start mb-2">
            <Ionicons name="information-circle" size={20} color="#2563EB" />
            <Text className="text-sm font-semibold text-blue-900 ml-2">
              Hướng dẫn test:
            </Text>
          </View>
          <Text className="text-xs text-blue-800 ml-7 leading-5">
            • Sử dụng 2 nút chính ở trên để test view{"\n"}
            • Hóa đơn inv-1: Chưa thanh toán, có thể test form thanh toán{"\n"}
            • Hóa đơn inv-2: Đã thanh toán, có lịch sử thanh toán{"\n"}
            • Tất cả data đều là mock, không ảnh hưởng API thật
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestScreen;
