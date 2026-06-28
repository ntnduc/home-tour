import { getListContract } from "@/api/contract/contract.api";
import Loading from "@/components/Loading";
import { ApiResponse } from "@/types/api";
import { BasePagingResponse } from "@/types/base.response";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import { ContractListResponse, ContractStatus } from "../../types/contract";
import HeaderComponents from "../common/HeaderComponents";
import ContractCard from "./components/ContractCard";


type ContractListScreenProps = {
  navigation: any;
};


const ContractListScreen = ({ navigation }: ContractListScreenProps) => {
  const [filterStatus, setFilterStatus] = useState<ContractStatus | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery<ApiResponse<BasePagingResponse<ContractListResponse>>, Error>({
      queryKey: ['contract', 1, 5, search],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getListContract({
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

  const flatData =
    data?.pages
      .filter((page) => page.data && page.data.items !== undefined)
      .flatMap((page) => page.data && page.data.items && page.data?.items) ??
    [];


  const renderFilterButtons = () => (
    <View
      style={{
        backgroundColor: colors.background.default,
        borderBottomColor: colors.border.light,
        borderBottomWidth: 1,
        paddingVertical: 8,
      }}
    >
      <View style={{ flexDirection: "row", paddingHorizontal: 16, gap: 8 }}>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor:
              filterStatus === null ? colors.primary.main : colors.border.main,
            backgroundColor:
              filterStatus === null
                ? colors.primary.main
                : colors.background.default,
          }}
          onPress={() => setFilterStatus(null)}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color:
                filterStatus === null
                  ? colors.text.inverse
                  : colors.text.secondary,
            }}
          >
            Tất cả 10
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor:
              filterStatus === ContractStatus.ACTIVE
                ? colors.status.success
                : colors.border.main,
            backgroundColor:
              filterStatus === ContractStatus.ACTIVE
                ? colors.status.success
                : colors.background.default,
          }}
          onPress={() => setFilterStatus(ContractStatus.ACTIVE)}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color:
                filterStatus === ContractStatus.ACTIVE
                  ? colors.text.inverse
                  : colors.text.secondary,
            }}
          >
            Đang hoạt động 10
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor:
              filterStatus === ContractStatus.EXPIRED
                ? colors.status.warning
                : colors.border.main,
            backgroundColor:
              filterStatus === ContractStatus.EXPIRED
                ? colors.status.warning
                : colors.background.default,
          }}
          onPress={() => setFilterStatus(ContractStatus.EXPIRED)}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color:
                filterStatus === ContractStatus.EXPIRED
                  ? colors.text.inverse
                  : colors.text.secondary,
            }}
          >
            Hết hạn 10
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor:
              filterStatus === ContractStatus.ENDED
                ? colors.status.error
                : colors.border.main,
            backgroundColor:
              filterStatus === ContractStatus.ENDED
                ? colors.status.error
                : colors.background.default,
          }}
          onPress={() => setFilterStatus(ContractStatus.ENDED)}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color:
                filterStatus === ContractStatus.ENDED
                  ? colors.text.inverse
                  : colors.text.secondary,
            }}
          >
            Đã kết thúc 10
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContractCard = (item: ContractListResponse) => {

    return (
      <ContractCard
        contract={item}
        onPress={() => navigation.navigate("ContractDetail", { contractId: item.id })}
        showActions={true}
        onViewDetails={() => {
          navigation.navigate('ContractDetail', {
            contractId: item?.id,
          });
        }
        }
        onTerminate={() =>
          navigation.navigate("TerminateContract", { contract: item })
        }
        onRenew={() => {
          // TODO: Implement renew contract
          console.log("Renew contract:", item.id);
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.default }} edges={['top']}>
      <HeaderComponents
        title="Danh Sách Hợp Đồng"
        isSearch
        searchConfig={{
          placeholder: "Tìm kiếm hợp đồng...",
          onSearch: (text: string) => {
            console.log("Search:", text);
          },
        }}
      >
        {/* {renderFilterButtons()} */}
      </HeaderComponents>

      {isLoading && (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Loading />
        </View>
      )}

      {/* Danh sách hợp đồng */}
      {!isLoading && <FlatList
        data={flatData ?? []}

        renderItem={(item) => {
          if (item.item) {
            return renderContractCard(item.item)
          }
          return <></>
        }}
        keyExtractor={(item, index) => item?.id ?? index.toString()}
        contentContainerStyle={{ padding: 10 }}
        showsVerticalScrollIndicator={false}

        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 80,
            }}
          >
            <Ionicons
              name="document-outline"
              size={64}
              color={colors.neutral.gray[500]}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: colors.text.secondary,
                marginTop: 16,
              }}
            >
              Không tìm thấy hợp đồng
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.text.disabled,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </Text>
          </View>
        }
        onEndReached={() => {
          fetchNextPage();
        }}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => { refetch(); }} />
        }
      />}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary.main,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.neutral.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
        onPress={() => {
          // Navigate to room list to select a room for creating contract
          navigation.navigate("RoomList");
        }}
      >
        <Ionicons name="add" size={24} color={colors.text.inverse} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ContractListScreen;
