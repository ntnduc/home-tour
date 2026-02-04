import UploadFile, { UploadedFile } from "@/components/Uploadfile";
import { RootStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type TestScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "TestScreen">;
};

const TestScreen = ({ navigation }: TestScreenProps) => {
  const handleChange = (files: UploadedFile | UploadedFile[] | null, status: 'success' | 'error' | 'loading') => {
    console.log('💞💓💗💞💓💗 ~ handleChange ~ status:', status)
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <UploadFile label="Upload file" type="image" multiple={false} onChange={handleChange} />
    </SafeAreaView>
  );
};

export default TestScreen;
