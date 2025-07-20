import {
  getComboDistricts,
  getComboProvinces,
  getComboWards,
} from "@/api/location/location.api";
import { getProperty, updateProperty } from "@/api/property/property.api";
import ActionButtonBottom from "@/components/ActionButtonBottom";
import { ComboBox } from "@/components/ComboBox";
import InputBase from "@/components/Input";
import Loading from "@/components/Loading";
import { ServiceCalculateMethod } from "@/constant/service.constant";
import { createStyles } from "@/styles/StyleCreateTenantScreent";
import { ComboOption } from "@/types/comboOption";
import {
  mapPropertyDetailToUpdateRequest,
  PropertyUpdateRequest,
} from "@/types/property";
import { ServiceCreateOrUpdateRequest } from "@/types/service";
import { formatCurrency, generateId } from "@/utils/appUtil";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { useTheme as useTamaguiTheme, XStack, YStack } from "tamagui";
import CalculatorMethodComponent from "./component/CalculatorMethodComponent";
import ServiceSelectedSearchComponent from "./component/ServiceSelectedSearchComponent";

type UpdateTenantScreenProps = {
  navigation: any;
  route: { params: { tenantId: string } };
};

type ServiceType = {
  index: number;
  name: string;
  price: number;
  calculationMethod: string;
};

const UpdateTenantScreen = ({ navigation, route }: UpdateTenantScreenProps) => {
  const theme = useTamaguiTheme();
  const styles = createStyles(theme);

  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<PropertyUpdateRequest>();
  const [cities, setCities] = useState<ComboOption<string, string>[]>([]);
  const [districts, setDistricts] = useState<ComboOption<string, string>[]>([]);
  const [wards, setWards] = useState<ComboOption<string, string>[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<
    "provinceCode" | "districtCode" | "wardCode" | null
  >(null);

  useEffect(() => {
    const featchData = async () => {
      const responseForm = await getProperty(route.params.tenantId);
      if (!responseForm?.data || !responseForm?.success) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không tìm thấy thông tin!",
        });
        navigation.goBack && navigation.goBack();
        return;
      }
      const formData = mapPropertyDetailToUpdateRequest(responseForm.data);

      setInitialData(formData);

      const fetch = [
        getComboProvinces(),
        getComboDistricts(formData.provinceCode),
        getComboWards(formData.districtCode),
      ];

      axios
        .all(fetch)
        .then(([responseProvince, responseDistricts, responseWards]) => {
          setCities(responseProvince.data || []);
          setDistricts(responseDistricts.data || []);
          setWards(responseWards.data || []);
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: "Lỗi",
            text2: "Không lấy được vị trí!",
          });
          navigation.goBack && navigation.goBack();
        });
    };
    featchData().finally(() => {
      setIsLoading(false);
    });
  }, [route.params.tenantId]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyUpdateRequest>({
    values: initialData,
  });

  const services: ServiceCreateOrUpdateRequest[] = watch("services");

  const handleAddService = () => {
    const currentServices: ServiceCreateOrUpdateRequest[] = watch("services");
    setValue("services", [
      ...currentServices,
      {
        id: generateId(),
        name: "",
        price: 0,
        calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
      },
    ]);
  };

  const handleRemoveService = (id: string) => {
    const newServices = [...(services ?? [])];
    newServices.splice(
      newServices.findIndex((service) => service.id === id),
      1
    );
    setValue("services", newServices);
  };

  const onSubmit = (data: PropertyUpdateRequest) => {
    setIsLoading(true);
    updateProperty(route.params.tenantId, data)
      .then((res) => {
        if (res.success) {
          Toast.show({
            type: "success",
            text1: "Thành công",
            text2: "Cập nhật tòa nhà thành công!",
          });
          navigation.goBack && navigation.goBack();
        } else {
          Toast.show({
            type: "error",
            text1: "Lỗi",
            text2: res.message,
          });
        }
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: err.response.data.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onError = (errors: FieldErrors) => {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.background?.val,
        }}
      >
        <YStack padding="$4" space="$4">
          <Controller
            control={control}
            name="name"
            rules={{ required: "Vui lòng nhập tên gợi nhớ" }}
            render={({ field: { onChange, value } }) => (
              <InputBase
                placeholder="Nhập tên gợi nhớ (không bắt buộc)"
                value={value}
                onChangeText={onChange}
                label="Tên gợi nhớ"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="provinceCode"
            rules={{ required: "Vui lòng chọn thành phố/tỉnh" }}
            render={({ field: { onChange, value } }) => (
              <ComboBox
                value={value}
                options={cities}
                onChange={onChange}
                placeholder="Chọn thành phố/tỉnh"
                error={errors.provinceCode?.message}
                onFocus={() => setActiveDropdown("provinceCode")}
                isActive={activeDropdown === "provinceCode"}
                label="Thành phố / Tỉnh"
              />
            )}
          />

          <Controller
            control={control}
            name="districtCode"
            rules={{ required: "Vui lòng chọn quận/huyện" }}
            render={({ field: { onChange, value } }) => (
              <ComboBox
                value={value}
                options={districts}
                onChange={onChange}
                placeholder="Chọn quận/huyện"
                error={errors.districtCode?.message}
                onFocus={() => setActiveDropdown("districtCode")}
                isActive={activeDropdown === "districtCode"}
                label="Quận / Huyện"
              />
            )}
          />

          <Controller
            control={control}
            name="wardCode"
            rules={{ required: "Vui lòng chọn phường/xã" }}
            render={({ field: { onChange, value } }) => (
              <ComboBox
                value={value}
                options={wards}
                onChange={onChange}
                placeholder="Chọn phường/xã"
                error={errors.wardCode?.message}
                onFocus={() => setActiveDropdown("wardCode")}
                isActive={activeDropdown === "wardCode"}
                label="Phường / Xã"
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            rules={{ required: "Vui lòng nhập địa chỉ chi tiết" }}
            render={({ field: { onChange, value } }) => (
              <InputBase
                placeholder="Nhập địa chỉ chi tiết"
                value={value}
                onChangeText={onChange}
                required={true}
                type="area"
                numberOfLines={3}
                label="Địa chỉ chi tiết"
                error={errors.address?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="defaultRoomRent"
            rules={{ required: "Vui lòng nhập giá thuê mặc định" }}
            render={({ field: { onChange, value } }) => (
              <InputBase
                label="Giá thuê mặc định"
                required={true}
                placeholder="Nhập giá thuê mặc định"
                value={value?.toString()}
                onChangeText={onChange}
                keyboardType="numeric"
                error={errors.defaultRoomRent?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="paymentDate"
            rules={{ required: "Vui lòng nhập ngày thanh toán" }}
            render={({ field: { onChange, value } }) => (
              <InputBase
                label="Ngày thanh toán"
                required={true}
                placeholder="Nhập ngày thanh toán"
                value={value?.toString()}
                onChangeText={onChange}
                keyboardType="numeric"
                error={errors.paymentDate?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="numberFloor"
            render={({ field: { onChange, value } }) => (
              <InputBase
                label="Số tầng"
                placeholder="Nhập số tầng"
                value={value?.toString()}
                onChangeText={onChange}
                keyboardType="numeric"
                error={errors.numberFloor?.message}
              />
            )}
          />

          {/* Dịch vụ thu phí */}
          <YStack space="$2">
            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginBottom="$2"
            >
              <Text style={styles.label}>Dịch vụ thu phí</Text>
              <TouchableOpacity
                style={styles.addServiceButton}
                onPress={handleAddService}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.addServiceButtonText}>Thêm dịch vụ</Text>
              </TouchableOpacity>
            </XStack>
            <YStack
              space="$3"
              backgroundColor="#f8f9fa"
              padding="$3"
              borderRadius="$4"
            >
              {services &&
                services?.map((service, index) => (
                  <YStack
                    key={index}
                    space="$2"
                    backgroundColor="#fff"
                    padding="$3"
                    borderRadius="$4"
                    borderWidth={1}
                    borderColor="#e9ecef"
                    marginBottom="$2"
                    style={{ position: "relative" }}
                  >
                    <TouchableOpacity
                      style={styles.removeServiceItemButton}
                      onPress={() => handleRemoveService(service.id)}
                    >
                      <Ionicons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                    <XStack space="$2" alignItems="center">
                      <YStack space="$2" flex={1}>
                        <Controller
                          control={control}
                          name={`services.${index}`}
                          render={({ field: { onChange, value } }) => (
                            <ServiceSelectedSearchComponent
                              value={value as any}
                              onChange={onChange}
                              error={errors.services?.[index]?.name?.message}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name={`services.${index}.price`}
                          rules={{ required: "Vui lòng nhập giá dịch vụ" }}
                          render={({ field: { onChange, value } }) => (
                            <InputBase
                              placeholder="Giá"
                              disabled={
                                service.calculationMethod ===
                                ServiceCalculateMethod.FREE
                              }
                              icon="cash-outline"
                              iconProps={{
                                color: "#007AFF",
                              }}
                              value={
                                service.calculationMethod ===
                                ServiceCalculateMethod.FREE
                                  ? "0"
                                  : value
                                  ? formatCurrency(value.toString())
                                  : ""
                              }
                              onChangeText={(text) => {
                                const numericValue = text.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                onChange(numericValue);
                              }}
                              keyboardType="numeric"
                              error={errors.services?.[index]?.price?.message}
                            />
                          )}
                        />
                        {errors.services?.[index]?.price && (
                          <Text style={styles.errorText}>
                            {errors.services[index]?.price?.message}
                          </Text>
                        )}
                        <Controller
                          control={control}
                          name={`services.${index}.calculationMethod`}
                          render={({ field: { onChange, value } }) => (
                            <CalculatorMethodComponent
                              value={value}
                              onChange={(newMethod) => {
                                onChange(newMethod);
                                if (newMethod === ServiceCalculateMethod.FREE) {
                                  setValue(`services.${index}.price`, 0);
                                }
                              }}
                            />
                          )}
                        />
                      </YStack>
                    </XStack>
                  </YStack>
                ))}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
      <ActionButtonBottom
        actions={[
          {
            label: "Cập nhật tòa nhà",
            onPress: handleSubmit(onSubmit, onError),
            variant: "primary",
            isLoading: isLoading,
            icon: "checkmark-circle",
          },
        ]}
      />
    </>
  );
};

export default UpdateTenantScreen;
