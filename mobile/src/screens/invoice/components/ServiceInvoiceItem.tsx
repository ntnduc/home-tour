import Input from '@/components/Input';
import {
  SERVICE_CALCULATE_METHOD_WITH_INFO,
  ServiceCalculateMethod,
} from '@/constant/service.constant';
import CardComponent from '@/screens/common/CardComponent';
import { ContractServiceInvoiceCalculateResponse } from '@/types/contract-service';
import { InvoiceDetailResponse } from '@/types/invoice';
import { formatCurrency, isAndroidSystem, isIOSSystem } from '@/utils/appUtil';
import { Ionicons } from '@expo/vector-icons';
import { Control, Controller } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';

interface ServiceInvoiceItemProps {
  control: Control<InvoiceDetailResponse, any, InvoiceDetailResponse>;
  service: ContractServiceInvoiceCalculateResponse;
  index: number;
  handleConfirmEditOld: (index: number) => void;
  setValue: (name: string, value: any) => void;
  getValues: (name: string) => any;
}

const ServiceInvoiceItem = ({
  control,
  service,
  handleConfirmEditOld,
  index,
  setValue,
  getValues,
}: ServiceInvoiceItemProps) => {
  const _serviceCalculatorSimple = () => {
    return (
      <CardComponent
        key={service.id}
        title={service.name}
        style={{
          elevation: isAndroidSystem() ? 3 : 0,
        }}
        className={`${isIOSSystem() ? 'shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : ''}`}
        description={`${formatCurrency(service.price)} đ/ ${SERVICE_CALCULATE_METHOD_WITH_INFO[service.calculationMethod].unit}`}
        renderActions={() => (
          <TouchableOpacity
            onPress={() => {
              handleConfirmEditOld(index);
            }}
            className={`flex-row items-center rounded-full px-3 py-1 
          ${
            getValues(`contractServices.${index}.isUpdated`)
              ? 'bg-blue-50 border border-blue-100'
              : 'bg-gray-50 border border-gray-100'
          }`}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={true ? '#1D4ED8' : '#1F2937'}
            />
            <Text
              className={`ml-1 text-sm font-semibold ${
                true ? 'text-blue-700' : 'text-gray-900'
              }`}
            >
              {false ? 'Đang mở chỉnh sửa' : 'Sửa số cũ'}
            </Text>
          </TouchableOpacity>
        )}
      >
        <View className="flex-row gap-3">
          <View className="flex-1 rounded-lg bg-white p-2 border border-gray-100">
            <Controller
              control={control}
              rules={{ required: 'Vui lòng nhập số cũ' }}
              name={`contractServices.${index}.oldHelperValue`}
              render={({ field: { onChange, value } }) => {
                return (
                  <Input
                    label="Số cũ"
                    value={value?.toString() || '0'}
                    type="number"
                    keyboardType="numeric"
                    min={0}
                    disabled={!getValues(`contractServices.${index}.isUpdated`)}
                    onChange={onChange}
                    showClear={false}
                  />
                );
              }}
            />
          </View>

          <View className="flex-1 rounded-lg bg-white p-2 border border-gray-100">
            <Controller
              control={control}
              name={`contractServices.${index}.newHelperValue`}
              rules={{ required: 'Vui lòng nhập số mới' }}
              render={({ field: { onChange, value } }) => {
                return (
                  <Input
                    label="Số mới"
                    value={value?.toString() || '0'}
                    type="number"
                    keyboardType="numeric"
                    required
                    onChange={onChange}
                    showClear={false}
                  />
                );
              }}
            />
          </View>
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-gray-700">Sản lượng</Text>
          <Text className="text-base font-semibold text-gray-900">
            {service.helperValue?.toString() || '0'}{' '}
            {SERVICE_CALCULATE_METHOD_WITH_INFO[service.calculationMethod].unit}
          </Text>
        </View>
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-gray-800">
            Tạm tính
          </Text>
          <Text className="text-xl font-extrabold text-blue-700">
            {formatCurrency(0)} đ
          </Text>
        </View>
      </CardComponent>
    );
  };

  const _renderServiceItem = () => {
    switch (service.calculationMethod) {
      case ServiceCalculateMethod.PER_UNIT_SIMPLE:
        return _serviceCalculatorSimple();
      default:
        return _serviceCalculatorSimple();
    }
  };

  return <View>{_serviceCalculatorSimple()}</View>;
};

export default ServiceInvoiceItem;
