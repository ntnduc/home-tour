import { getComboProperty } from "@/api/property/property.api";
import { getListRoom } from "@/api/room/room.api";
import AppSheet, { AppSheetRef } from "@/components/AppSheet/AppSheet";
import Loading from "@/components/Loading";
import { ApiResponse } from "@/types/api";
import { BasePagingResponse } from "@/types/base.response";
import { ComboOptionWithExtra } from "@/types/comboOption";
import { PropertyDetail } from "@/types/property";
import { RoomListResponse } from "@/types/room";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BuildingSelector from "../../components/BuildingSelector";
import PaymentSummary from "../../components/PaymentSummary";
import { RootStackParamList } from "../../navigation/types";
import { colors } from "../../theme/colors";
import { PaymentStatus } from "../../types/payment";
import HeaderComponents from "../common/HeaderComponents";
import BuildingFilterComponent from "./components/BuildingFilterComponent";
import RoomCardItemComponent from "./components/RoomCardItemComponents";
import styles from "./styles/StyleRoomList";

type RoomListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "RoomList">;
  route: RouteProp<RootStackParamList, "RoomList">;
};

const RoomListScreen = ({ navigation, route }: RoomListScreenProps) => {
  const { propertyId } = route.params || {};
  const refAppSheet = useRef<AppSheetRef>(null);

  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | null>(
    null
  );
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [comboProperty, setComboProperty] =
    useState<ComboOptionWithExtra<string, string, PropertyDetail>[]>();

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery<ApiResponse<BasePagingResponse<RoomListResponse>>, Error>({
      queryKey: ["rooms", 1, 5, search, selectedBuilding],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getListRoom({
          limit: 5,
          offset: ((pageParam as number) - 1) * 5,
          globalKey: search,
          filters: {
            propertyId: selectedBuilding,
          },
        }),
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data?.total && lastPage.data?.total > pages.length
          ? pages.length + 1
          : undefined;
      },
    });

  useEffect(() => {
    getComboProperty()
      .then((response) => {
        const data = response.data;
        const options = [...(data ?? [])];
        setComboProperty(options);
      })
      .catch((error) => {
        // Nothing
        console.error(
          "💞💓💗💞💓💗 ~ error:",
          JSON.stringify(error.response.data.message)
        );
        return [];
      })
      .finally(() => {
        // Nothing
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPayment === null && styles.filterButtonActive,
          ]}
          onPress={() => setFilterPayment(null)}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterPayment === null && styles.filterButtonTextActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPayment === PaymentStatus.PENDING &&
              styles.filterButtonActive,
          ]}
          onPress={() => setFilterPayment(PaymentStatus.PENDING)}
        >
          <Ionicons
            name="time-outline"
            size={14}
            color={
              filterPayment === PaymentStatus.PENDING
                ? colors.neutral.white
                : colors.text.secondary
            }
          />
          <Text
            style={[
              styles.filterButtonText,
              filterPayment === PaymentStatus.PENDING &&
                styles.filterButtonTextActive,
            ]}
          >
            Chờ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPayment === PaymentStatus.OVERDUE &&
              styles.filterButtonActive,
          ]}
          onPress={() => setFilterPayment(PaymentStatus.OVERDUE)}
        >
          <Ionicons
            name="warning-outline"
            size={14}
            color={
              filterPayment === PaymentStatus.OVERDUE
                ? colors.neutral.white
                : colors.text.secondary
            }
          />
          <Text
            style={[
              styles.filterButtonText,
              filterPayment === PaymentStatus.OVERDUE &&
                styles.filterButtonTextActive,
            ]}
          >
            Quá hạn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPayment === PaymentStatus.PAID && styles.filterButtonActive,
          ]}
          onPress={() => setFilterPayment(PaymentStatus.PAID)}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={14}
            color={
              filterPayment === PaymentStatus.PAID
                ? colors.neutral.white
                : colors.text.secondary
            }
          />
          <Text
            style={[
              styles.filterButtonText,
              filterPayment === PaymentStatus.PAID &&
                styles.filterButtonTextActive,
            ]}
          >
            Đã thanh toán
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const flatData =
    data?.pages
      .filter((page) => page.data && page.data.items !== undefined)
      .flatMap((page) => page.data && page.data.items && page.data?.items) ??
    [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header cố định */}
      <View style={styles.fixedHeader}>
        <HeaderComponents
          className="px-2 mb-2"
          title="Danh Sách Phòng"
          isSearch
          searchConfig={{
            placeholder: "Tìm kiếm phòng hoặc tòa nhà...",
            onSearch: (text) => setSearch(text),
          }}
        />
        <BuildingSelector
          buildings={comboProperty ?? []}
          selectedBuilding={
            selectedBuilding === "Tất cả" ? null : selectedBuilding
          }
          onOpen={() => {
            refAppSheet.current?.open(
              <BuildingFilterComponent
                buildings={comboProperty ?? []}
                selectedBuilding={selectedBuilding}
                onSelectedBuiling={(id) => {
                  setSelectedBuilding(id);
                  refAppSheet.current?.close();
                }}
              />,
              {
                header: {
                  title: "Chọn toà nhà",
                },
              }
            );
          }}
        />
        {renderFilterButtons()}
      </View>
      {isLoading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading />
        </View>
      )}
      {!isLoading && (
        <View style={styles.scrollContainer}>
          <FlatList
            data={flatData}
            renderItem={({ item }) =>
              item ? (
                <RoomCardItemComponent item={item} navigation={navigation} />
              ) : null
            }
            keyExtractor={(item, index) => item?.id ?? index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <PaymentSummary
                totalRooms={0}
                pendingPayments={0}
                overduePayments={0}
                paidPayments={0}
                totalAmount={0}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Không tìm thấy phòng phù hợp.
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  refetch();
                }}
              />
            }
            onEndReached={() => {
              fetchNextPage();
            }}
            onEndReachedThreshold={0.2}
          />
        </View>
      )}
      <AppSheet ref={refAppSheet} />
    </SafeAreaView>
  );
};

export default RoomListScreen;
