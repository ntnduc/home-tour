import { formatPhoneNumber } from "@/utils/appUtil";
import React from "react";
import { Text } from "react-native";
type Props = {
  children?: React.ReactNode | string | any;
  className?: string;
};
const DisplayPhoneNumber = ({ children, className }: Props) => {
  if (typeof children === "string") {
    const phoneNumber = formatPhoneNumber(children);
    return <Text className={className}>{phoneNumber}</Text>;
  }
  return <Text className={className}>{children}</Text>;
};

export default DisplayPhoneNumber;
