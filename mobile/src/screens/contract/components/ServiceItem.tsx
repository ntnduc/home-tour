import Input from "@/components/Input";
import {
  SERVICE_CALCULATE_METHOD_WITH_INFO,
  ServiceCalculateMethod,
} from "@/constant/service.constant";
import CardComponent from "@/screens/common/CardComponent";
import { ContractServiceCreateRequest } from "@/types/contract-service";
import { formatCurrency } from "@/utils/appUtil";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { useDebounce } from "use-debounce";

interface ServiceItemProps {
  service: ContractServiceCreateRequest;
  index: number;
  onEdit: () => void;
  onChange: (service: ContractServiceCreateRequest) => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  index,
  onEdit,
  onChange,
}) => {
  const getActions = () => {
    return ["edit"];
  };

  const _onChangeHelperValue = useDebounce((text: string) => {
    onChange({ ...service, helperValue: Number(text) });
  }, 1000);

  return (
    <CardComponent
      title={
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Text
              className="font-semibold text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {service?.name}
            </Text>
          </View>
        </View>
      }
      description={
        <View className="mt-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-base font-semibold text-blue-600 flex-1">
                {formatCurrency(service?.price?.toString() ?? "0") +
                  " đ/" +
                  SERVICE_CALCULATE_METHOD_WITH_INFO[service.calculationMethod]
                    .unit}
              </Text>
              <Ionicons
                name={
                  SERVICE_CALCULATE_METHOD_WITH_INFO[service.calculationMethod]
                    .icon
                }
                size={16}
                color="#6B7280"
                className="mr-2"
              />
              <Text
                className="text-xs text-gray-600 mr-3"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {
                  SERVICE_CALCULATE_METHOD_WITH_INFO[service.calculationMethod]
                    .label
                }
              </Text>
            </View>
          </View>
        </View>
      }
      actions={getActions()}
      onActionPress={(key) => {
        if (key === "edit") onEdit();
      }}
    >
      {service.isEnabled &&
        service.calculationMethod ===
          ServiceCalculateMethod.PER_UNIT_SIMPLE && (
          <View className="mt-3">
            <Input
              required
              type="number"
              labelStyles={{
                color: "#6B7280",
                fontSize: 13,
              }}
              defaultValue={service.helperValue?.toString()}
              label={`Chỉ số hiện tại (${service.name
                ?.toLocaleLowerCase()
                ?.trim()})`}
              onChangeText={(text) => _onChangeHelperValue[0](text)}
            />
          </View>
        )}
      {service.isEnabled &&
        service.calculationMethod ===
          ServiceCalculateMethod.FIXED_PER_NUMBER && (
          <View className="mt-3">
            <Input
              required
              type="number"
              labelStyles={{
                color: "#6B7280",
                fontSize: 13,
              }}
              defaultValue={service.helperValue?.toString()}
              onChangeText={(text) => _onChangeHelperValue[0](text)}
              label={`Số lượng sử dụng`}
            />
          </View>
        )}
      <View className="mt-3 pt-3 border-t border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`w-2 h-2 rounded-full mr-2 ${
                service.isEnabled ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <Text
              className={`text-xs ${
                service.isEnabled ? "text-green-600" : "text-gray-500"
              }`}
            >
              {service.isEnabled ? "Đã chọn trong hợp đồng" : "Không sử dụng"}
            </Text>
          </View>
        </View>
      </View>
    </CardComponent>
  );
};

export default ServiceItem;
