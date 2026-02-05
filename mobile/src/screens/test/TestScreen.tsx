import CommonUpload from "@/components/Uploadfile";
import { RootStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type TestScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "TestScreen">;
};

const TestScreen = ({ navigation }: TestScreenProps) => {
  // const handleChange = (
  //   files: UploadedFile | UploadedFile[] | null,
  //   status: 'success' | 'error' | 'loading' | 'prepare',
  // ) => {
  //   console.log('💞💓💗💞💓💗 ~ handleChange ~ status:', status)
  // };

  const [value, setValue] = useState(0);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CommonUpload label="Upload file" type="image" variant="single" onChange={() => { }} />
      {/* <SliderLoading value={value} height={12} animateFromCenter={false} showShimmer />
      <Text>{value}</Text>
      <ButtonAction text="Upload" onPress={() => {
        setValue(value + 10);
      }} />
      <ButtonAction text="reset" onPress={() => {
        setValue(0);
      }} /> */}
    </SafeAreaView>
  );
};

export default TestScreen;
