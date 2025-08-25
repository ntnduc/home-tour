import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

// Components
import Input from "@/components/Input";

// Types & Constants
import { ComboBox } from "@/components/ComboBox";
import {
  SERVICE_CALCULATE_METHOD_WITH_INFO,
  ServiceCalculateMethod,
} from "@/constant/service.constant";
import { ContractServiceDetailResponse } from "@/types/contract-service";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Controller, useForm } from "react-hook-form";

interface ContractServiceComponentProps {
  onConfirm?: () => void;
  contractService: ContractServiceDetailResponse;
}

interface CalculationMethodOption {
  key: ServiceCalculateMethod;
  value: ServiceCalculateMethod;
  label: string;
  icon: string;
  info: string;
  unit: string;
}

const ContractServiceComponent: React.FC<ContractServiceComponentProps> = ({
  onConfirm,
  contractService,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, defaultValues },
  } = useForm<ContractServiceDetailResponse>({
    defaultValues: contractService,
  });

  const handleConfirm = () => {
    const confirm = onConfirm?.();
    if (confirm) {
      return;
    }
  };

  const calculationMethodOptions = Object.entries(
    SERVICE_CALCULATE_METHOD_WITH_INFO
  ).map(([key, value]) => ({
    key: key as ServiceCalculateMethod,
    value: value,
    label: value.label,
    icon: value.icon,
    info: value.info,
    unit: value.unit,
  }));

  const renderCalculationMethodItem = (item: CalculationMethodOption) => (
    <View className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-2">
      <View className="flex-row items-center mb-2">
        <Ionicons name={item.icon as any} size={20} color="#3B82F6" />
        <Text className="text-base font-semibold text-gray-800 ml-3 flex-1">
          {item.label}
        </Text>
      </View>
      <Text className="text-sm text-gray-600 mb-2 ml-8 leading-5">
        {item.info}
      </Text>
      <Text className="text-xs text-gray-500 ml-8 italic">
        Đơn vị: {item.unit}
      </Text>
    </View>
  );

  return (
    <BottomSheetScrollView className="p-4" nestedScrollEnabled={true}>
      <View className="mb-3">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Tên dịch vụ"
              required={true}
              disabled={true}
              error={errors.name?.message}
              placeholder="Nhập tên dịch vụ"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View className="mb-3">
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Giá dịch vụ"
              required={true}
              error={errors.price?.message}
              placeholder="Nhập giá dịch vụ"
              value={value.toString()}
              onChangeText={onChange}
              keyboardType="numeric"
              icon="cash-outline"
            />
          )}
        />
      </View>

      <View className="mb-3">
        <Controller
          control={control}
          name="calculationMethod"
          render={({ field: { onChange, value } }) => (
            <ComboBox
              value={value as any}
              options={calculationMethodOptions}
              required={true}
              onChange={(item) => {
                onChange(item);
              }}
              isSearch={false}
              placeholder="Chọn phương thức tính toán"
              error={errors.calculationMethod?.message}
              label="Phương thức tính toán"
              icon={(value, options, visible) => {
                if (value && !value?.icon) {
                  const findIconInOptions = options.find(
                    (option) => option.key === value
                  );
                  if (findIconInOptions) {
                    return (
                      <Ionicons
                        name={findIconInOptions.icon as any}
                        size={18}
                        className="mr-3 ml-[-1px]"
                        color="#6B7280"
                      />
                    );
                  }
                }
                if (value?.icon) {
                  return (
                    <Ionicons
                      name={value.icon as any}
                      size={18}
                      className="mr-3 ml-[-1px]"
                      color="#6B7280"
                    />
                  );
                }
                return null;
              }}
            />
          )}
        />
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Trạng thái dịch vụ
        </Text>
        <View className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-green-500 rounded-full mr-3" />
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-800">
                Đang hoạt động
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Dịch vụ đang được cung cấp trong hợp đồng
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Tóm tắt cấu hình
        </Text>

        <View className="space-y-3">
          <View className="flex-row justify-between items-center py-2 border-b border-blue-200">
            <Text className="text-base text-gray-600 font-medium">
              Phương thức:
            </Text>
            <Text className="text-base text-gray-800 font-semibold text-right flex-1">
              {
                SERVICE_CALCULATE_METHOD_WITH_INFO[
                  defaultValues?.calculationMethod as ServiceCalculateMethod
                ].label
              }
            </Text>
          </View>

          {defaultValues?.calculationMethod !== ServiceCalculateMethod.FREE && (
            <View className="flex-row justify-between items-center py-2 border-b border-blue-200">
              <Text className="text-base text-gray-600 font-medium">
                Giá dịch vụ:
              </Text>
              <Text className="text-base text-gray-800 font-semibold text-right flex-1">
                {parseFloat(
                  defaultValues?.price?.toString() || "0"
                ).toLocaleString("vi-VN")}{" "}
                VNĐ
              </Text>
            </View>
          )}

          <View className="flex-row justify-between items-center py-2">
            <Text className="text-base text-gray-600 font-medium">
              Trạng thái:
            </Text>
            <Text className="text-base text-green-600 font-semibold text-right flex-1">
              Đang hoạt động
            </Text>
          </View>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

export default ContractServiceComponent;
