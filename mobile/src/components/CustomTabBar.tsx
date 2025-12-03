import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

interface CustomTabBarProps {
  navigationState: {
    index: number;
    routes: Array<{
      key: string;
      title: string;
      icon?: string;
    }>;
  };
  position: Animated.AnimatedInterpolation<string | number>;
  setIndex: (index: number) => void;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  navigationState,
  position,
  setIndex,
}) => {
  const inputRange = navigationState.routes.map((_, i) => i);

  return (
    <View className="bg-white border-b border-gray-100">
      <View className="flex-row px-2 py-1">
        {navigationState.routes.map((route, index) => {
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) => (i === index ? 1 : 0.6)),
            extrapolate: "clamp",
          });

          const scale = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) => (i === index ? 1.05 : 1)),
            extrapolate: "clamp",
          });

          const isActive = navigationState.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => setIndex(index)}
              className="flex-1 items-center py-3 px-2"
              activeOpacity={0.7}
            >
              <Animated.View
                style={{
                  opacity,
                  transform: [{ scale }],
                }}
                className="items-center"
              >
                {route.icon && (
                  <Text className="text-lg mb-1">{route.icon}</Text>
                )}
                <Text
                  className={`text-sm font-semibold ${
                    isActive ? "text-primary-main" : "text-gray-500"
                  }`}
                >
                  {route.title}
                </Text>
                {isActive && (
                  <View className="w-6 h-0.5 bg-primary-main rounded-full mt-2" />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
