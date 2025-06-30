import { getListProperty } from "@/api/property/property.api";
import Loading from "@/components/Loading";
import { ApiResponse } from "@/types/api";
import { BasePagingResponse } from "@/types/base.response";
import { PropertyListResponse } from "@/types/property";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";
import HeaderComponents from "../common/HeaderComponents";
import TenantCardComponent from "./component/TenantCardComponent";

type RootStackParamList = {
  RoomDetail: { roomId: string };
  EditBuilding: { buildingId: string };
  AddRoom: { buildingId: string };
  RoomList: { buildingId?: string };
  CreateTenant: undefined;
};

type RoomListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const TenantListScreen = ({ navigation }: RoomListScreenProps) => {
  const [search, setSearch] = useState("");

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery<
      ApiResponse<BasePagingResponse<PropertyListResponse>>,
      Error
    >({
      queryKey: ["properties", 1, 5, search],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getListProperty({
          limit: 5,
          offset: ((pageParam as number) - 1) * 5,
          globalKey: search,
        }),
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data?.total && lastPage.data?.total > pages.length
          ? pages.length + 1
          : undefined;
      },
    });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const flatData = data?.pages.flatMap((page) => page.data?.items) || [];
  const totalBuildings = flatData.length;
  let totalRooms = 0;
  flatData.forEach((item) => {
    totalRooms += item?.totalRoom ?? 0;
  });
  let totalTenants = 0;
  flatData.forEach((item) => {
    totalTenants += item?.totalRoomOccupied ?? 0;
  });

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
      <View>
        <HeaderComponents
          title="Quản lý tòa nhà"
          isSearch
          searchConfig={{
            placeholder: "Tìm kiếm tòa nhà...",
            onSearch: handleSearch,
            className: "mx-2",
          }}
        />
      </View>
      {isLoading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading />
        </View>
      )}
      {!isLoading && (
        <FlatList
          data={flatData as PropertyListResponse[]}
          renderItem={({ item }) => {
            return (
              <TenantCardComponent
                tenantInfo={item}
                onUpdate={() => {
                  /* Xử lý tạo tòa nhà */
                }}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                refetch();
              }}
            />
          }
          ListHeaderComponent={
            <View style={styles.statsRow}>
              <View
                style={[
                  styles.statsBox,
                  { backgroundColor: colors.primary.light },
                ]}
              >
                <Text style={styles.statsIcon}>🏢</Text>
                <Text style={styles.statsValue}>{totalBuildings}</Text>
                <Text style={styles.statsLabel}>Tòa nhà</Text>
              </View>
              <View
                style={[
                  styles.statsBox,
                  { backgroundColor: colors.status.success + "20" },
                ]}
              >
                <Text style={styles.statsIcon}>🔑</Text>
                <Text style={styles.statsValue}>{totalRooms}</Text>
                <Text style={styles.statsLabel}>Phòng</Text>
              </View>
              <View
                style={[
                  styles.statsBox,
                  { backgroundColor: colors.status.warning + "20" },
                ]}
              >
                <Text style={styles.statsIcon}>👤</Text>
                <Text style={styles.statsValue}>{totalTenants}</Text>
                <Text style={styles.statsLabel}>Đã thuê</Text>
              </View>
            </View>
          }
          // stickyHeaderIndices={[0]}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ color: colors.text.secondary }}>
                Không tìm thấy tòa nhà phù hợp.
              </Text>
            </View>
          }
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate("CreateTenant");
        }}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  statsBox: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: colors.background.paper,
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statsIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  statsValue: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.primary.main,
  },
  statsLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: colors.primary.main,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary.main,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  fabIcon: {
    color: colors.neutral.white,
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2,
  },

  statusRow: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export default TenantListScreen;
