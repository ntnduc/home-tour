import Input from "@/components/Input";
import CardComponent from "@/screens/common/CardComponent";
import { ClientCreateRequest } from "@/types/client";
import { ContractCreateRequest } from "@/types/contract";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

type PartnerClientsSectionProps = {
  control: Control<ContractCreateRequest>;
  clients: ClientCreateRequest[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

const PartnerClientsSection: React.FC<PartnerClientsSectionProps> = ({
  control,
  clients,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const landlordIndex = 0;
  const companionClients = (clients || []).filter(
    (_, index) => index !== landlordIndex
  );

  const hasCompanion = companionClients.length > 0;

  return (
    <CardComponent
      title="Người ở cùng"
      description="Nếu có người ở cùng, hãy thêm thông tin để quản lý rõ ràng hơn"
      renderActions={() => (
        <TouchableOpacity
          className="flex-row items-center px-3 py-2 rounded-full bg-emerald-50 border border-emerald-200"
          onPress={onAdd}
        >
          <Ionicons name="person-add-outline" size={18} color="#059669" />
          <Text className="ml-2 text-sm font-medium text-emerald-700">
            Thêm người ở cùng
          </Text>
        </TouchableOpacity>
      )}
    >
      {!hasCompanion ? (
        <View className="items-center justify-center py-6">
          <Ionicons name="people-circle-outline" size={40} color="#9CA3AF" />
          <Text className="mt-3 text-sm text-gray-500">
            Chưa thêm người ở cùng nào
          </Text>
          <Text className="text-xs text-gray-400 mt-1 text-center">
            Bạn có thể bỏ qua bước này nếu không có người ở cùng
          </Text>
        </View>
      ) : (
        <View className="flex flex-col gap-3">
          {companionClients.map((client, idx) => {
            const index = idx + 1; // map lại index thật trong contractClient
            return (
              <View
                key={`companion-${index}`}
                className="p-3 rounded-xl border border-gray-100 bg-gray-50"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-semibold text-gray-900">
                      {client.name || `${index}`}
                    </Text>
                    {client.phone ? (
                      <Text className="text-xs text-gray-500 mt-1">
                        SĐT: {client.phone}
                      </Text>
                    ) : null}
                  </View>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => onEdit(index)}
                      className="px-2 py-1 mr-2 rounded-full bg-blue-50"
                    >
                      <Text className="text-xs font-medium text-blue-600">
                        Cập nhật
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onDelete(index)}
                      className="px-2 py-1 rounded-full bg-red-50"
                    >
                      <Text className="text-xs font-medium text-red-500">
                        Xóa
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {client.idCardNumber || client.permanentAddress ? (
                  <View className="mt-1">
                    {client.idCardNumber ? (
                      <Text className="text-xs text-gray-500">
                        CCCD/CMND: {client.idCardNumber}
                      </Text>
                    ) : null}
                    {client.permanentAddress ? (
                      <Text className="text-xs text-gray-500 mt-0.5">
                        Địa chỉ: {client.permanentAddress}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      )}

      <View className="mt-4">
        <Controller
          control={control}
          name="partnerClientCount"
          render={({ field: { onChange, value } }) => (
            <View>
              <Input
                label="Số lượng người ở cùng"
                value={value?.toString()}
                onChangeText={onChange}
                placeholder="Nhập số lượng người ở cùng"
                type="number"
                icon="people-outline"
                keyboardType="numeric"
              />
            </View>
          )}
        />
      </View>
    </CardComponent>
  );
};

export default PartnerClientsSection;
