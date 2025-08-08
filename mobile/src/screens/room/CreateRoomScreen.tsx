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

type CreateRoomScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CreateRoom">;
  route: RouteProp<RootStackParamList, "CreateRoom">;
};

const CreateRoomScreen = ({ navigation, route }: CreateRoomScreenProps) => {
  const { propertyId } = route.params;

  const handleSave = () => {
    // TODO: Implement room creation logic
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Tạo Phòng Mới
        </Text>

        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-sm text-gray-500 text-center py-10">
            Form tạo phòng cho tài sản ID: {propertyId}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-green-600 p-4 rounded-xl items-center"
          onPress={handleSave}
        >
          <Text className="text-white text-base font-semibold">Lưu Phòng</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles moved to Tailwind classes

export default CreateRoomScreen;
