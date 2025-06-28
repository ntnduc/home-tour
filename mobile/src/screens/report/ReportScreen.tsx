import React from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import HeaderComponents from "../common/HeaderComponents";

const routes = [
  { key: "first", title: "First" },
  { key: "second", title: "Second" },
];

const mockData = [
  {
    title: "Tổng quan",
    content: "Tổng quan",
  },
  {
    title: "Tổng quan 2",
    content: "Tổng quan 2",
  },
  {
    title: "Tổng quan 3",
    content: "Tổng quan 3",
  },
  {
    title: "Tổng quan 4",
    content: "Tổng quan 4",
  },
  {
    title: "Tổng quan 5",
    content: "Tổng quan 5",
  },
  {
    title: "Tổng quan 6",
    content: "Tổng quan 6",
  },
];

const renderScene = SceneMap({
  first: () => (
    <FlatList
      data={mockData}
      ListHeaderComponent={() => (
        <View className="flex-1 justify-center items-center h-11">
          <Text>123</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View className="flex-1 justify-center items-center h-11">
          <Text>{item.title}</Text>
        </View>
      )}
    />
  ),
  second: () => (
    <View className="flex-1 justify-center items-center">
      <Text>second</Text>
    </View>
  ),
});

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "red", height: 3 }} // Đổi màu line dưới tab
    style={{ backgroundColor: "white", elevation: 0 }} // Đổi màu nền tab
    tabStyle={{
      backgroundColor: "red",
      color: "black",
      fontWeight: "bold",
      fontSize: 16,
      marginHorizontal: 10,
    }}

    // renderLabel={({ route, focused }: { route: any; focused: boolean }) => (
    //   <Text
    //     style={{
    //       color: focused ? "red" : "black",
    //       fontWeight: "bold",
    //       fontSize: 16,
    //       marginHorizontal: 10,
    //     }}
    //   >
    //     123
    //   </Text>
    // )}
  />
);

const ReportScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar className="bg-black" />
      <View>
        <HeaderComponents title="Báo cáo" isSearch />
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

export default ReportScreen;
