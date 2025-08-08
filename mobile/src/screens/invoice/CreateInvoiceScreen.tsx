import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../navigation/types";

type CreateInvoiceScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CreateInvoice">;
  route: RouteProp<RootStackParamList, "CreateInvoice">;
};

const CreateInvoiceScreen = ({
  navigation,
  route,
}: CreateInvoiceScreenProps) => {
  const { contractId } = route.params;

  const handleSave = () => {
    // TODO: Implement invoice creation logic
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Tạo Hóa Đơn Mới
        </Text>

        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-sm text-gray-500 text-center py-10">
            Form tạo hóa đơn cho hợp đồng ID: {contractId}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-orange-600 p-4 rounded-xl items-center"
          onPress={handleSave}
        >
          <Text className="text-white text-base font-semibold">
            Tạo Hóa Đơn
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles moved to Tailwind classes

export default CreateInvoiceScreen;
