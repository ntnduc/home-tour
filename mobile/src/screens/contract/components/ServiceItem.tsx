import CheckboxComponent from "@/components/Checkbox";
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

  return (
    <CardComponent
      title={
        <View className="flex-row items-center">
          <CheckboxComponent
            className="mr-2"
            id={index.toString()}
            onCheckedChange={(val) =>
              onChange({ ...service, isEnabled: !!val })
            }
            checked={service.isEnabled}
          />
          <Text className="font-semibold text-lg">{service?.name}</Text>
        </View>
      }
      description={
        <View className="flex-row items-center mt-1">
          <Text className="text-sm text-gray-600">
            {formatCurrency(service?.price?.toString() ?? "0") + "đ "}
          </Text>
          <Ionicons
            name={
              SERVICE_CALCULATE_METHOD_WITH_INFO[service.calculationMethod].icon
            }
            size={16}
            color="#6B7280"
            className="mr-1"
          />
          <Text className="text-sm text-gray-600">
            {SERVICE_CALCULATE_METHOD_WITH_INFO[service.calculationMethod].unit}
          </Text>
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
          <Input
            required
            type="number"
            labelStyles={{
              color: "#6B7280",
              fontSize: 14,
            }}
            label={`Số ${service.name?.toLocaleLowerCase()} hiện tại`}
            onChangeText={(text) =>
              onChange({ ...service, price: Number(text) })
            }
          />
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
              className={`text-sm ${
                service.isEnabled ? "text-green-600" : "text-gray-500"
              }`}
            >
              {service.isEnabled ? "Đã chọn" : "Không sử dụng"}
            </Text>
          </View>

          {/* {service.isNew && (
            <View className="bg-blue-100 px-2 py-1 rounded-full">
              <Text className="text-xs font-medium text-blue-700">Mới</Text>
            </View>
          )} */}
        </View>
      </View>
    </CardComponent>
  );
};

export default ServiceItem;
