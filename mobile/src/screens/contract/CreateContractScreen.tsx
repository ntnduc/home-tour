import ActionButtonBottom from "@/components/ActionButtonBottom";
import CardContent from "@/components/CardContent";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { ContractServiceDetailResponse } from "@/types/contract-service";
import { formatCurrency } from "@/utils/appUtil";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import { getRoomService } from "../../api/room/room.api";
import { ContractCreateRequest } from "../../types/contract";
import { RoomServiceDetailResponse, RoomStatus } from "../../types/room";
import CardComponent from "../common/CardComponent";
import ContractServiceComponent, {
  ContractServiceComponentRef,
} from "./components/ContractServiceComponent";
import ServiceItem from "./components/ServiceItem";

type RootStackParamList = {
  CreateContract: { roomId: string };
  RoomList: undefined;
};

type CreateContractScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: { params: { roomId: string } };
};

const CreateContractScreen = ({
  navigation,
  route,
}: CreateContractScreenProps) => {
  const { roomId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [roomData, setRoomData] = useState<RoomServiceDetailResponse | null>(
    null
  );

  const { control, watch, getValues, setValue, reset, setFocus } =
    useForm<ContractCreateRequest>();
  const { fields: contractServices, update } = useFieldArray({
    control,
    name: "contractServices",
    keyName: "fieldId",
  });

  const contractServiceRef = useRef<ContractServiceComponentRef>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setIsLoading(true);

        const roomServiceResponse = await getRoomService(roomId);

        if (roomServiceResponse.success && roomServiceResponse.data) {
          const room = roomServiceResponse.data;
          setRoomData(room);
          reset({
            roomId: room.id,
            propertyId: room.propertyId,
            rentAmountAgreed: room.rentAmount,
            depositAmountPaid: room.defaultDepositAmount,
            paymentDueDay: room.defaultPaymentDueDay,
            contractServices: room.contractServices,
          });
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin phòng và dịch vụ");
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  const openContractServiceForm = (
    service: ContractServiceDetailResponse,
    index: number
  ) => {
    contractServiceRef.current?.expand(service, index);
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert("Thành công", "Đã tạo hợp đồng thành công!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("RoomList"),
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo hợp đồng");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!roomData) {
    return <Loading />;
  }

  if (roomData.status !== RoomStatus.AVAILABLE) {
    Toast.show({
      type: "error",
      text1: "Lỗi",
      text2: "Phòng không khả dụng!",
    });
    navigation.goBack();
    return null;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardOpeningTime={0}
        enableAutomaticScroll={true}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CardContent>
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-1">
                {roomData?.name || "Tên phòng"}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">
                {roomData?.property?.name || "Tên tòa nhà"}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-gray-500 mb-1">Giá thuê</Text>
              <Text className="text-lg font-bold text-blue-600">
                {formatCurrency(roomData?.rentAmount?.toString() || "0")}
                đ/tháng
              </Text>
            </View>
          </View>
        </CardContent>

        <CardContent title="Thời hạn thuê">
          <View className="mb-3">
            <Controller
              control={control}
              name="startDate"
              rules={{ required: "Vui lòng chọn ngày bắt đầu" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DatePicker
                  label="Ngày bắt đầu"
                  value={value}
                  showClear={false}
                  onChange={onChange}
                  placeholder="Chọn ngày bắt đầu"
                  required
                  minDate={new Date()}
                  error={error?.message}
                  icon="calendar"
                />
              )}
            />
          </View>

          <View>
            <Controller
              control={control}
              name="endDate"
              rules={{ required: "Vui lòng chọn ngày kết thúc" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DatePicker
                  label="Ngày kết thúc (tùy chọn)"
                  value={value}
                  onChange={onChange}
                  placeholder="Chọn ngày kết thúc"
                  error={error?.message}
                  icon="calendar"
                  minDate={
                    watch("startDate")
                      ? new Date(watch("startDate") ?? "")
                      : new Date()
                  }
                />
              )}
            />
          </View>
        </CardContent>

        <CardContent title="Thông tin thanh toán">
          <View className="mb-3">
            <Controller
              control={control}
              name="rentAmountAgreed"
              rules={{ required: "Vui lòng nhập tiền thuê hàng tháng" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <Input
                    type="number"
                    label="Tiền thuê hàng tháng"
                    value={value ? formatCurrency(value.toString()) : ""}
                    onChangeText={onChange}
                    placeholder="Nhập tiền thuê hàng tháng"
                    error={error?.message}
                    icon="cash"
                    keyboardType="numeric"
                    returnKeyType="done"
                    returnKeyLabel="Xong"
                    required
                    showClear={false}
                  />
                );
              }}
            />
          </View>

          <View className="mb-3">
            <Controller
              control={control}
              name="depositAmountPaid"
              rules={{ required: "Vui lòng nhập tiền cọc" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  label="Tiền cọc"
                  value={value ? formatCurrency(value.toString()) : ""}
                  onChangeText={onChange}
                  placeholder="Nhập tiền cọc"
                  error={error?.message}
                  icon="shield-checkmark"
                  keyboardType="numeric"
                  returnKeyType="done"
                  returnKeyLabel="Xong"
                />
              )}
            />
          </View>

          {/* <View className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <Text className="text-sm font-semibold text-blue-800 mb-1">
              Tổng tiền cọc (bao gồm dịch vụ):
            </Text>
            <Text className="text-lg font-bold text-blue-600">
              {formatCurrency("1000")}đ
            </Text>
          </View> */}
        </CardContent>

        <CardComponent
          title="Dịch vụ"
          description="Bạn muốn thêm dịch vụ mới hãy tạo dịch vụ trong tòa nhà!"
        >
          {contractServices.length === 0 ? (
            <View className="flex-1 items-center justify-center py-12">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="construct-outline" size={24} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 text-base mb-2">
                Chưa có dịch vụ nào
              </Text>
              <Text className="text-gray-400 text-sm text-center">
                Hãy tạo thêm dịch vụ trong cập nhật tòa nhà
              </Text>
            </View>
          ) : (
            contractServices.map((service, index) => (
              <Controller
                key={service.fieldId || index}
                control={control}
                name={`contractServices.${index}`}
                render={({ field: { value } }) => (
                  <ServiceItem
                    key={`service-item-${
                      service.propertyServiceId || index
                    }-${index}`}
                    service={service}
                    index={index}
                    onEdit={() =>
                      openContractServiceForm(
                        value as ContractServiceDetailResponse,
                        index
                      )
                    }
                    onChange={(service) => update(index, service)}
                  />
                )}
              />
            ))
          )}

          {/* <View className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-medium text-blue-700 mb-1">
                  Tổng tiền dịch vụ hàng tháng
                </Text>
                <Text className="text-xs text-blue-600">
                  Bao gồm tất cả dịch vụ đã chọn
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    getValues("contractServices")
                      ?.filter((service) => service.isEnabled)
                      .reduce(
                        (total, service) => total + (service.price || 0),
                        0
                      )
                      .toString() || "0"
                  )}
                  đ
                </Text>
                <Text className="text-xs text-blue-500">/tháng</Text>
              </View>
            </View>
          </View> */}
        </CardComponent>

        <CardContent title="Điều khoảng bổ sung">
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <Input
                type="area"
                value={value}
                onChangeText={onChange}
                placeholder="Nhập điều khoảng bổ sung (tùy chọn)"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            )}
          />
        </CardContent>
      </KeyboardAwareScrollView>
      <ActionButtonBottom
        actions={[
          {
            label: "Tạo hợp đồng",
            icon: "checkmark-circle",
            isLoading,
            onPress: handleSave,
          },
        ]}
      />
      <ContractServiceComponent
        ref={contractServiceRef}
        onSuccess={(service, index) => {
          update(index, service);
        }}
      />
    </View>
  );
};

export default CreateContractScreen;
