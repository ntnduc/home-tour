import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { TouchableWithoutFeedback } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface CustomBackdropProps extends BottomSheetBackdropProps {
  onBackdropPress?: () => void;
}

const AppSheetBackdropComponent = ({
  animatedIndex,
  style,
  onBackdropPress,
}: CustomBackdropProps) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 0.5]),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      containerAnimatedStyle,
    ],
    [containerAnimatedStyle]
  );

  return (
    <TouchableWithoutFeedback onPress={onBackdropPress}>
      <Animated.View style={containerStyle} />
    </TouchableWithoutFeedback>
  );
};

export default AppSheetBackdropComponent;
