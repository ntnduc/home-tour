import React, { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  children: ReactNode;
  title?: string | ReactNode;
  description?: string | ReactNode;
};

const CardContent = (props: Props) => {
  const descriptionElement =
    typeof props.description === "string" ? (
      <Text className="text-sm text-gray-600 mb-2 italic">
        {props.description}
      </Text>
    ) : (
      props.description
    );

  const titleElement =
    typeof props.title === "string" ? (
      <View className="mb-4">
        <Text className="text-lg font-bold text-gray-900 ">{props.title}</Text>
        {descriptionElement}
      </View>
    ) : (
      props.title
    );

  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      {titleElement}
      {props.children}
    </View>
  );
};

export default CardContent;
