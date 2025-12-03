import React from "react";
import { View } from "react-native";

type Props = {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: number;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
};

const CheckboxComponent = ({
  id,
  checked,
  onCheckedChange,
  size,
  className,
  defaultChecked,
  disabled,
  icon,
}: Props) => {
  return <View className={className}></View>;
};

export default CheckboxComponent;
