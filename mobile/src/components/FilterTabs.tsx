import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

interface FilterTab {
  key: string;
  title: string;
  icon?: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  variant?: "default" | "pill" | "underline";
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeTab,
  onTabPress,
  variant = "default",
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);
    Animated.spring(animatedValue, {
      toValue: activeIndex,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [activeTab]);

  const renderDefaultTab = (tab: FilterTab, index: number) => {
    const isActive = activeTab === tab.key;

    return (
      <TouchableOpacity
        key={tab.key}
        onPress={() => onTabPress(tab.key)}
        className={`flex-1 py-3 px-4 rounded-lg mx-1 ${
          isActive ? "bg-primary-main" : "bg-gray-100"
        }`}
        activeOpacity={0.7}
      >
        <View className="items-center">
          {tab.icon && <Text className="text-lg mb-1">{tab.icon}</Text>}
          <Text
            className={`text-sm font-semibold ${
              isActive ? "text-white" : "text-gray-600"
            }`}
          >
            {tab.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPillTab = (tab: FilterTab, index: number) => {
    const isActive = activeTab === tab.key;

    return (
      <TouchableOpacity
        key={tab.key}
        onPress={() => onTabPress(tab.key)}
        className={`px-6 py-3 rounded-full mx-1 ${
          isActive
            ? "bg-primary-main shadow-lg"
            : "bg-white border border-gray-200"
        }`}
        activeOpacity={0.7}
        style={{
          shadowColor: isActive ? colors.primary.main : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isActive ? 0.3 : 0,
          shadowRadius: 4,
          elevation: isActive ? 4 : 0,
        }}
      >
        <View className="flex-row items-center">
          {tab.icon && <Text className="text-base mr-2">{tab.icon}</Text>}
          <Text
            className={`text-sm font-semibold ${
              isActive ? "text-white" : "text-gray-700"
            }`}
          >
            {tab.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderUnderlineTab = (tab: FilterTab, index: number) => {
    const isActive = activeTab === tab.key;

    return (
      <TouchableOpacity
        key={tab.key}
        onPress={() => onTabPress(tab.key)}
        className="flex-1 py-4 px-2"
        activeOpacity={0.7}
      >
        <View className="items-center">
          <Text
            className={`text-sm font-semibold mb-2 ${
              isActive ? "text-primary-main" : "text-gray-500"
            }`}
          >
            {tab.title}
          </Text>
          <View
            className={`h-1 w-8 rounded-full ${
              isActive ? "bg-primary-main" : "bg-transparent"
            }`}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderTab = (tab: FilterTab, index: number) => {
    switch (variant) {
      case "pill":
        return renderPillTab(tab, index);
      case "underline":
        return renderUnderlineTab(tab, index);
      default:
        return renderDefaultTab(tab, index);
    }
  };

  return (
    <View className="bg-white rounded-xl p-2 shadow-sm">
      <View className="flex-row">
        {tabs.map((tab, index) => renderTab(tab, index))}
      </View>
    </View>
  );
};

export default FilterTabs;
