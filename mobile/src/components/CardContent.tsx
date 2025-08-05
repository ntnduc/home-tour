import React, { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  children: ReactNode;
};

const CardContent = (props: Props) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      {props.children}
    </View>
  );
};

export default CardContent;
