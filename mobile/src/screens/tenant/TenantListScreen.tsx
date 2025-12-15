import { getListTenant, TenantListResponse } from '@/api/tenant/tenant.api';
import FabButton from '@/components/FabButton';
import Loading from '@/components/Loading';
import { ApiResponse } from '@/types/api';
import { BasePagingResponse } from '@/types/base.response';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import HeaderComponents from '../common/HeaderComponents';
import TenantCardComponent from './components/TenantCardComponent';

type TenantListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TenantList'>;
};

const TenantListScreen = ({ navigation }: TenantListScreenProps) => {
  const [search, setSearch] = useState('');

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery<
      ApiResponse<BasePagingResponse<TenantListResponse>>,
      Error
    >({
      queryKey: ['tenants', 1, 5, search],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getListTenant({
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
    }, [refetch]),
  );

  const flatData = data?.pages.flatMap((page) => page.data?.items) || [];
  const totalTenants = flatData.length;
  let activeContracts = 0;
  flatData.forEach((item) => {
    if (item?.contractStatus === 'active') activeContracts++;
  });
  let totalRevenue = 0;
  flatData.forEach((item) => {
    if (item?.contractStatus === 'active')
      totalRevenue += item?.rentAmount ?? 0;
  });

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const handleCreateTenant = () => {
    // navigation.navigate("CreateTenant");
  };

  const handleTenantPress = (tenantId: string) => {
    navigation.navigate('TenantDetail', { tenantId });
  };

  const handleUpdateTenant = (tenantId: string) => {
    navigation.navigate('UpdateTenant', { tenantId });
  };

  return (
    <SafeAreaView className="flex-1">
      {/* <StatusBar barStyle="dark-content" backgroundColor={"#fff"} /> */}
      <HeaderComponents
        title="Quản lý khách thuê"
        isSearch
        searchConfig={{
          placeholder: 'Tìm kiếm khách thuê...',
          onSearch: handleSearch,
          className: 'mx-2',
        }}
      />
      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <Loading />
        </View>
      )}
      {!isLoading && (
        <FlatList
          data={flatData as TenantListResponse[]}
          renderItem={({ item }) => {
            return (
              <TenantCardComponent
                tenant={item}
                onPress={() => handleTenantPress(item.id)}
                onUpdate={() => handleUpdateTenant(item.id)}
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
                <Text style={styles.statsIcon}>👤</Text>
                <Text style={styles.statsValue}>{totalTenants}</Text>
                <Text style={styles.statsLabel}>Khách thuê</Text>
              </View>
              <View
                style={[
                  styles.statsBox,
                  { backgroundColor: colors.status.success + '20' },
                ]}
              >
                <Text style={styles.statsIcon}>📋</Text>
                <Text style={styles.statsValue}>{activeContracts}</Text>
                <Text style={styles.statsLabel}>Hợp đồng</Text>
              </View>
              <View
                style={[
                  styles.statsBox,
                  { backgroundColor: colors.status.warning + '20' },
                ]}
              >
                <Text style={styles.statsIcon}>💰</Text>
                <Text style={styles.statsValue}>
                  {totalRevenue.toLocaleString()}
                </Text>
                <Text style={styles.statsLabel}>Doanh thu</Text>
              </View>
            </View>
          }
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text style={{ color: colors.text.secondary }}>
                Không tìm thấy khách thuê phù hợp.
              </Text>
            </View>
          }
        />
      )}
      <FabButton
        icon="add"
        iconSize={32}
        iconStyle={{ marginTop: -2 }}
        onPress={handleCreateTenant}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  statsBox: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 14,
    alignItems: 'center',
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
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.primary.main,
  },
  statsLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },

  statusRow: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export default TenantListScreen;
