import React from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import { colors } from "../theme/colors";

const screenWidth = Dimensions.get("window").width;

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface EnhancedChartProps {
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  type?: "bar" | "line" | "area";
  height?: number;
  showValues?: boolean;
  showGrid?: boolean;
}

const EnhancedChart: React.FC<EnhancedChartProps> = ({
  data,
  title,
  subtitle,
  type = "bar",
  height = 200,
  showValues = true,
  showGrid = true,
}) => {
  const animatedValues = React.useRef(
    data.map(() => new Animated.Value(0))
  ).current;

  React.useEffect(() => {
    const maxValue = Math.max(...data.map((item) => item.value));

    const animations = data.map((item, index) =>
      Animated.timing(animatedValues[index], {
        toValue: item.value / maxValue,
        duration: 1000 + index * 100,
        useNativeDriver: false,
      })
    );

    Animated.stagger(100, animations).start();
  }, [data]);

  const maxValue = Math.max(...data.map((item) => item.value));
  const barWidth = (screenWidth - 80) / data.length - 10;

  const renderBarChart = () => (
    <View style={{ height: height - 60 }}>
      {showGrid && (
        <View className="absolute inset-0">
          {[0, 0.25, 0.5, 0.75, 1].map((line, index) => (
            <View
              key={index}
              className="absolute w-full border-b border-gray-100"
              style={{ top: line * (height - 60) }}
            />
          ))}
        </View>
      )}

      <View className="flex-row items-end justify-between px-4 h-full">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 80);

          return (
            <View key={index} className="items-center">
              <Animated.View
                style={{
                  width: barWidth,
                  height: animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, barHeight],
                  }),
                  backgroundColor: item.color || colors.primary.main,
                  borderRadius: 6,
                  marginBottom: 8,
                  shadowColor: item.color || colors.primary.main,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              />
              <Text
                className="text-xs text-gray-600 text-center"
                numberOfLines={1}
              >
                {item.label}
              </Text>
              {showValues && (
                <Text className="text-xs font-semibold text-gray-800 mt-1">
                  {(item.value / 1000000).toFixed(1)}M
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderLineChart = () => (
    <View style={{ height: height - 60 }}>
      {showGrid && (
        <View className="absolute inset-0">
          {[0, 0.25, 0.5, 0.75, 1].map((line, index) => (
            <View
              key={index}
              className="absolute w-full border-b border-gray-100"
              style={{ top: line * (height - 60) }}
            />
          ))}
        </View>
      )}

      <View className="flex-row items-end justify-between px-4 h-full">
        {data.map((item, index) => {
          const pointHeight = (item.value / maxValue) * (height - 80);
          const isLast = index === data.length - 1;

          return (
            <View key={index} className="items-center flex-1">
              <Animated.View
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: item.color || colors.primary.main,
                  borderRadius: 4,
                  marginBottom: 8,
                  transform: [
                    {
                      translateY: animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [height - 80, height - 80 - pointHeight],
                      }),
                    },
                  ],
                  shadowColor: item.color || colors.primary.main,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              />
              {!isLast && (
                <View
                  className="absolute top-4 w-full h-0.5 bg-primary-main opacity-30"
                  style={{ left: "50%" }}
                />
              )}
              <Text
                className="text-xs text-gray-600 text-center mt-2"
                numberOfLines={1}
              >
                {item.label}
              </Text>
              {showValues && (
                <Text className="text-xs font-semibold text-gray-800 mt-1">
                  {(item.value / 1000000).toFixed(1)}M
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderAreaChart = () => (
    <View style={{ height: height - 60 }}>
      {showGrid && (
        <View className="absolute inset-0">
          {[0, 0.25, 0.5, 0.75, 1].map((line, index) => (
            <View
              key={index}
              className="absolute w-full border-b border-gray-100"
              style={{ top: line * (height - 60) }}
            />
          ))}
        </View>
      )}

      <View className="flex-row items-end justify-between px-4 h-full">
        {data.map((item, index) => {
          const areaHeight = (item.value / maxValue) * (height - 80);

          return (
            <View key={index} className="items-center flex-1">
              <Animated.View
                style={{
                  width: barWidth,
                  height: animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, areaHeight],
                  }),
                  backgroundColor: item.color || colors.primary.main,
                  borderRadius: 6,
                  marginBottom: 8,
                  opacity: 0.7,
                }}
              />
              <Text
                className="text-xs text-gray-600 text-center"
                numberOfLines={1}
              >
                {item.label}
              </Text>
              {showValues && (
                <Text className="text-xs font-semibold text-gray-800 mt-1">
                  {(item.value / 1000000).toFixed(1)}M
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderChart = () => {
    switch (type) {
      case "line":
        return renderLineChart();
      case "area":
        return renderAreaChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      {title && (
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
          {subtitle && (
            <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
          )}
        </View>
      )}

      {renderChart()}

      <View className="mt-4 flex-row flex-wrap justify-center">
        {data.map((item, index) => (
          <View key={index} className="flex-row items-center mx-2 mb-2">
            <View
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color || colors.primary.main }}
            />
            <Text className="text-xs text-gray-600">{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default EnhancedChart;
