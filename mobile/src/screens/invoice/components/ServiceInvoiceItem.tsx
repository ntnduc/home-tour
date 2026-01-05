import Input from '@/components/Input';
import {
  SERVICE_CALCULATE_METHOD_WITH_INFO,
  ServiceCalculateMethod,
} from '@/constant/service.constant';
import CardComponent from '@/screens/common/CardComponent';
import { InvoiceCreateRequest } from '@/types/invoice';
import { InvoiceItemCreateRequest } from '@/types/invoice.item';
import { formatCurrency, isAndroidSystem, isIOSSystem } from '@/utils/appUtil';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';

interface ServiceInvoiceItemProps {
  control: Control<InvoiceCreateRequest, InvoiceCreateRequest, any>;
  service: InvoiceItemCreateRequest;
  index: number;
  handleConfirmEditOld: (index: number) => void;
  getValues: (name: string) => any;
}

const ServiceInvoiceItem = ({
  control,
  service,
  handleConfirmEditOld,
  index,
  getValues,
}: ServiceInvoiceItemProps) => {
  const helperValueNew = useWatch({
    control,
    name: `invoiceItems.${index}.newHelperValue`,
  });

  const oldHelperValue = useWatch({
    control,
    name: `invoiceItems.${index}.oldHelperValue`,
  });

  const calPrice = useMemo(() => {
    if (Number(helperValueNew) <= Number(oldHelperValue)) {
      return 0;
    }
    return (
      Number(service.amount) * ((helperValueNew ?? 0) - (oldHelperValue ?? 0))
    );
  }, [helperValueNew, oldHelperValue]);

  const _serviceCalculatorSimple = () => {
    return (
      <CardComponent
        key={service.contractServiceId}
        title={service.name}
        style={{
          elevation: isAndroidSystem() ? 3 : 0,
        }}
        className={`${isIOSSystem() ? 'shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : ''}`}
        description={`${formatCurrency(service.amount)} đ/ ${SERVICE_CALCULATE_METHOD_WITH_INFO[service.calculationMethod].unit}`}
        renderActions={() => (
          <TouchableOpacity
            onPress={() => {
              handleConfirmEditOld(index);
            }}
            className={`flex-row items-center rounded-full px-3 py-1 
          ${
            getValues(`contractServices.${index}.isUpdated`)
              ? 'bg-yellow-50 border border-yellow-100'
              : 'bg-gray-50 border border-gray-100'
          }`}
          >
            <Ionicons
              name={
                getValues(`contractServices.${index}.isUpdated`)
                  ? 'refresh-outline'
                  : 'create-outline'
              }
              size={18}
              color={
                getValues(`contractServices.${index}.isUpdated`)
                  ? '#eab308'
                  : '#1D4ED8'
              }
            />
            <Text
              className={`ml-1 text-sm font-semibold ${
                getValues(`contractServices.${index}.isUpdated`)
                  ? 'text-yellow-500'
                  : 'text-blue-700'
              }`}
            >
              {getValues(`contractServices.${index}.isUpdated`)
                ? 'Hủy và đặt lại'
                : 'Sửa số cũ'}
            </Text>
          </TouchableOpacity>
        )}
      >
        <View className="flex-row gap-3">
          <View className="flex-1 rounded-lg bg-white p-2 border border-gray-100">
            <Controller
              control={control}
              rules={{ required: 'Vui lòng nhập số cũ' }}
              name={`invoiceItems.${index}.oldHelperValue`}
              render={({ field: { onChange, value } }) => {
                return (
                  <Input
                    label="Số cũ"
                    value={value?.toString()}
                    type="number"
                    keyboardType="numeric"
                    min={0}
                    disabled={!getValues(`invoiceItems.${index}.isUpdated`)}
                    onChangeText={onChange}
                    showClear={false}
                  />
                );
              }}
            />
          </View>

          <View className="flex-1 rounded-lg bg-white p-2 border border-gray-100">
            <Controller
              control={control}
              name={`invoiceItems.${index}.newHelperValue`}
              rules={{ required: 'Vui lòng nhập số mới' }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <Input
                    label="Số mới"
                    value={value?.toString()}
                    type="number"
                    keyboardType="numeric"
                    required
                    error={error?.message}
                    onChangeText={onChange}
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
            {formatCurrency(calPrice)} đ
          </Text>
          {/* <Controller
            control={control}
            name={`contractServices.${index}.oldHelperValue`}
            render={({ field: { onChange, value } }) => {
              const calPrice =
                Number(service.price) * (helperValueNew ?? 0 - (value ?? 0));
              return (
                
              );
            }}
          /> */}
        </View>
      </CardComponent>
    );
  };

  const _serviceCalculatorFixedPerRoom = () => {
    return (
      <CardComponent
        style={{
          elevation: isAndroidSystem() ? 3 : 0,
        }}
        title={service.name}
        className={`${isIOSSystem() ? 'shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : ''}`}
        key={service.contractServiceId}
      >
        <View className=" flex-row items-center justify-between">
          <Text className="text-base font-semibold text-gray-800">
            Tạm tính
          </Text>
          <Text className="text-xl font-extrabold text-blue-700">
            {formatCurrency(service.amount)} đ
          </Text>
        </View>
      </CardComponent>
    );
  };

  const _serviceCalculatorFixedPerPerson = () => {
    return (
      <CardComponent
        style={{
          elevation: isAndroidSystem() ? 3 : 0,
        }}
        className={`${isIOSSystem() ? 'shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : ''}`}
        key={service.contractServiceId}
        title={service.name}
        description={`${formatCurrency(service.amount)} đ/ ${SERVICE_CALCULATE_METHOD_WITH_INFO[service.calculationMethod].unit}`}
        renderActions={() => (
          <TouchableOpacity
            onPress={() => {
              handleConfirmEditOld(index);
            }}
            className={`flex-row items-center rounded-full px-3 py-1 
          ${
            getValues(`invoiceItems.${index}.isUpdated`)
              ? 'bg-yellow-50 border border-yellow-100'
              : 'bg-gray-50 border border-gray-100'
          }`}
          >
            <Ionicons
              name={
                getValues(`invoiceItems.${index}.isUpdated`)
                  ? 'refresh-outline'
                  : 'create-outline'
              }
              size={18}
              color={
                getValues(`invoiceItems.${index}.isUpdated`)
                  ? '#eab308'
                  : '#1D4ED8'
              }
            />
            <Text
              className={`ml-1 text-sm font-semibold ${
                getValues(`invoiceItems.${index}.isUpdated`)
                  ? 'text-yellow-500'
                  : 'text-blue-700'
              }`}
            >
              {getValues(`invoiceItems.${index}.isUpdated`)
                ? 'Hủy và đặt lại'
                : 'Sửa số người'}
            </Text>
          </TouchableOpacity>
        )}
      >
        <View className="flex-1 rounded-lg bg-white p-2 border border-gray-100">
          <Controller
            control={control}
            name={`invoiceItems.${index}.oldHelperValue`}
            render={({ field: { onChange, value } }) => {
              return (
                <Input
                  label="Số người"
                  disabled={!getValues(`invoiceItems.${index}.isUpdated`)}
                  value={value?.toString()}
                  type="number"
                  keyboardType="numeric"
                  required
                  onChangeText={onChange}
                  showClear={false}
                />
              );
            }}
          />
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-800">
              Tạm tính
            </Text>
            <Controller
              control={control}
              name={`invoiceItems.${index}.oldHelperValue`}
              render={({ field: { onChange, value } }) => {
                const calPrice = Number(service.amount) * (value ?? 0);
                return (
                  <Text className="text-xl font-extrabold text-blue-700">
                    {formatCurrency(calPrice)} đ
                  </Text>
                );
              }}
            />
          </View>
        </View>
      </CardComponent>
    );
  };

  const _renderServiceItem = () => {
    switch (service.calculationMethod) {
      case ServiceCalculateMethod.PER_UNIT_SIMPLE:
        return _serviceCalculatorSimple();
      case ServiceCalculateMethod.FIXED_PER_ROOM:
        return _serviceCalculatorFixedPerRoom();
      case ServiceCalculateMethod.FIXED_PER_PERSON:
        return _serviceCalculatorFixedPerPerson();
      default:
        return <View></View>;
    }
  };

  return <View>{_renderServiceItem()}</View>;
};

export default ServiceInvoiceItem;
