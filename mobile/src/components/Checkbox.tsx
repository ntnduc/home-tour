import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { createCheckbox, Stack, styled } from "tamagui";

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

const Frame = styled(Stack, {
  borderWidth: 1,
  borderColor: "$borderColor",
  borderRadius: 5,
  alignItems: "center",
  justifyContent: "center",
  variants: {
    checked: {
      indeterminate: {},
      true: {
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
      },
      false: {
        backgroundColor: "$color3",
      },
    },
  } as const,

  defaultVariants: {
    checked: false,
  },
});

const Indicator = styled(Stack, {});

export const Checkbox = createCheckbox({
  Frame,
  Indicator,
});

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
  return (
    <View className={className}>
      <Checkbox
        defaultChecked={defaultChecked}
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        size={size}
        disabled={disabled}
      >
        <Checkbox.Indicator>
          {icon || <Ionicons name="checkmark" size={16} color="white" />}
        </Checkbox.Indicator>
      </Checkbox>
    </View>
  );
};

export default CheckboxComponent;
