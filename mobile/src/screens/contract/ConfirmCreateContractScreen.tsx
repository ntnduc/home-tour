import { createContract } from '@/api/contract/contract.api';
import ActionButtonBottom from '@/components/ActionButtonBottom';
import Loading from '@/components/Loading';
import {
  SERVICE_CALCULATE_METHOD_WITH_INFO,
  ServiceCalculateMethod,
} from '@/constant/service.constant';
import { RootStackParamList } from '@/navigation/types';
import CardComponent from '@/screens/common/CardComponent';
import { formatCurrency } from '@/utils/appUtil';
import { formatDate } from '@/utils/dateUtil';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

type ConfirmCreateContractScreenProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'ConfirmCreateContract'
  >;
  route: { params: RootStackParamList['ConfirmCreateContract'] };
};

const ConfirmCreateContractScreen = ({
  navigation,
  route,
}: ConfirmCreateContractScreenProps) => {
  const { contract, room, property } = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const depositTotal = useMemo(() => {
    return contract.depositAmountPaid || 0;
  }, [contract.depositAmountPaid]);

  const landlordClient = useMemo(() => {
    return contract.contractClient.find((client) => client.isLandlordClient);
  }, [contract.contractClient]);

  const onEdit = () => {
    navigation.goBack();
  };

  const onConfirm = async () => {
    try {
      setIsSubmitting(true);
      const response = await createContract(contract);
      if (response.success && response.data) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Tạo hợp đồng thành công',
        });
        navigation.popToTop();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: response.message ?? 'Tạo hợp đồng thất bại!',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.response.data.message ?? 'Tạo hợp đồng thất bại!',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRow = (
    label: string,
    value?: string | number,
    strong?: boolean,
  ) => (
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-base text-gray-600">{label}</Text>
      <Text
        className={`text-base ${strong ? 'font-semibold text-gray-900' : 'text-gray-900'}`}
      >
        {value}
      </Text>
    </View>
  );

  if (isSubmitting) {
    return <Loading />;
  }

  return (
    <>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          paddingBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardOpeningTime={0}
        enableAutomaticScroll={true}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cảnh báo nếu không có ngày kết thúc */}
        {!contract.endDate && (
          // <CardComponent>
          // <View className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <View className="flex-row items-center w-full bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <Ionicons name="alert-circle-outline" size={18} color="#CA8A04" />
            <Text className="text-sm text-yellow-700 ml-2 flex-1">
              Hợp đồng chưa xác định ngày kết thúc. Vui lòng đảm bảo hai bên đã
              thống nhất.
            </Text>
          </View>
          // </View>
          // </CardComponent>
        )}

        {/* Header tổng quan */}
        <CardComponent>
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-1">
                Xác nhận tạo hợp đồng
              </Text>
              <Text className="text-sm text-gray-600">
                Kiểm tra kỹ các thông tin trước khi xác nhận
              </Text>
            </View>
            <TouchableOpacity
              onPress={onEdit}
              className="px-3 py-2 rounded-lg bg-white border border-gray-200"
            >
              <View className="flex-row items-center">
                <Ionicons name="create-outline" size={16} color="#374151" />
                <Text className="text-gray-700 text-sm font-medium ml-1">
                  Chỉnh sửa
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </CardComponent>

        {/* Tiền cọc - nhấn mạnh thanh toán ngay khi xác nhận */}
        <CardComponent>
          <View className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color="#B45309"
                />
                <Text className="ml-2 text-sm font-semibold text-amber-700">
                  Tiền cọc phải thanh toán
                </Text>
              </View>
              <View className="px-2 py-1 rounded-full bg-amber-100 border border-amber-200">
                <Text className="text-[11px] font-semibold text-amber-700">
                  THANH TOÁN NGAY
                </Text>
              </View>
            </View>
            <Text className="text-3xl font-extrabold text-amber-700">
              {formatCurrency((depositTotal || 0).toString())}đ
            </Text>
            <Text className="text-xs text-amber-700 mt-2">
              Số tiền này sẽ được thanh toán ngay khi bạn bấm xác nhận hợp đồng.
            </Text>
          </View>
        </CardComponent>

        {/* Phòng & Tòa nhà */}
        <CardComponent title="Thông tin phòng">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              {renderRow('Phòng', room || '-')}
              {renderRow('Tòa nhà', property || '-')}
            </View>
            {/* <View className="items-end">
              <Text className="text-xs text-gray-500 mb-1">Giá thuê</Text>
              <Text className="text-lg font-bold text-blue-600">
                {formatCurrency((contract.rentAmountAgreed || 0).toString())}
                đ/tháng
              </Text>
            </View> */}
          </View>
        </CardComponent>

        {/* Người thuê chính */}
        <CardComponent title="Người thuê">
          <View>
            {renderRow('Họ và tên', landlordClient?.name || '-')}
            {renderRow('Số điện thoại', landlordClient?.phoneNumber || '-')}
            {renderRow('CCCD/CMND', landlordClient?.idCardNumber || '-')}
            {renderRow('Số người ở cùng', contract.partnerClientCount ?? 0)}
          </View>
        </CardComponent>

        {/* Thời hạn hợp đồng */}
        <CardComponent title="Thời hạn hợp đồng">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-1">
              <Text className="text-sm text-gray-600 mb-1">Ngày bắt đầu</Text>
              <Text className="text-base font-semibold text-gray-900">
                {contract.startDate ? formatDate(contract.startDate) : '-'}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#6B7280" />
            <View className="flex-1 items-end">
              <Text className="text-sm text-gray-600 mb-1">Ngày kết thúc</Text>
              <Text className="text-base font-semibold text-gray-900">
                {contract.endDate
                  ? formatDate(contract.endDate)
                  : 'Không xác định'}
              </Text>
            </View>
          </View>
        </CardComponent>

        {/* Thanh toán */}
        <CardComponent title="Thông tin thanh toán">
          <View>
            {renderRow(
              'Tiền thuê hàng tháng',
              `${formatCurrency((contract.rentAmountAgreed || 0).toString())}đ`,
              true,
            )}
            {renderRow(
              'Tiền cọc (thanh toán ban đầu)',
              `${formatCurrency((depositTotal || 0).toString())}đ`,
            )}
            <View className="h-[1px] bg-gray-200 my-2" />
            {renderRow(
              'Ngày thu tiền hàng tháng',
              contract.paymentDueDay ? `Ngày ${contract.paymentDueDay}` : '-',
            )}
          </View>
        </CardComponent>

        {/* Dịch vụ */}
        <CardComponent
          title="Dịch vụ áp dụng"
          description="Các dịch vụ được tính cùng tiền phòng"
        >
          {(contract.contractServices || []).length === 0 ? (
            <View className="flex-1 items-center justify-center py-8">
              <View className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="construct-outline" size={22} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500">Chưa có dịch vụ nào</Text>
            </View>
          ) : (
            <View className="flex flex-col">
              {(contract.contractServices || []).map((service, idx) => {
                const method =
                  service.calculationMethod as ServiceCalculateMethod;
                const methodInfo = SERVICE_CALCULATE_METHOD_WITH_INFO[method];
                return (
                  <View
                    key={`${service.propertyServiceId || service.serviceId || idx}`}
                    className="flex-row items-center justify-between py-3 border-b border-gray-100"
                  >
                    <View className="flex-row items-center flex-1">
                      <Ionicons
                        name={
                          service.isEnabled
                            ? 'checkmark-circle'
                            : 'close-circle'
                        }
                        size={18}
                        color={service.isEnabled ? '#34C759' : '#FF3B30'}
                      />
                      <View className="ml-2 flex-1">
                        <Text className="text-base font-medium text-gray-900">
                          {service.name || 'Dịch vụ'}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {methodInfo?.label || 'Phương thức'}
                          {service.helperValue
                            ? ` · SL: ${service.helperValue} ${methodInfo?.unit || ''}`
                            : ''}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-sm font-semibold text-gray-900">
                        {formatCurrency((service.price || 0).toString())}đ
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {method === ServiceCalculateMethod.PER_UNIT_SIMPLE
                          ? '/đơn vị'
                          : '/tháng'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </CardComponent>

        <CardComponent title="Điều khoản bổ sung">
          <Text className="text-sm text-gray-800">
            {contract.notes ?? 'Không có điều khoản bổ sung'}
          </Text>
        </CardComponent>
      </KeyboardAwareScrollView>

      <ActionButtonBottom
        actions={[
          {
            label: 'Xác nhận tạo hợp đồng',
            icon: 'checkmark-circle',
            variant: 'success',
            isLoading: isSubmitting,
            onPress: onConfirm,
          },
          {
            label: 'Chỉnh sửa thông tin',
            icon: 'create-outline',
            variant: 'secondary',
            onPress: onEdit,
          },
        ]}
      />
    </>
  );
};

export default ConfirmCreateContractScreen;
