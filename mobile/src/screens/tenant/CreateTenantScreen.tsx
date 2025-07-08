import {
  getComboDistricts,
  getComboProvinces,
  getComboWards,
} from "@/api/location/location.api";
import { ComboBox } from "@/components/ComboBox";
import InputBase from "@/components/Input";
import Loading from "@/components/Loading";
import { ServiceCalculateMethod } from "@/constant/service.constant";
import { createStyles } from "@/styles/StyleCreateTenantScreent";
import { ComboOption } from "@/types/comboOption";
import { PropertyCreateRequest } from "@/types/property";
import { formatCurrency, generateId } from "@/utils/appUtil";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useId, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";

import { createProperty } from "@/api/property/property.api";
import { getServiceDefault } from "@/api/service/service.api";
import ActionButtonBottom from "@/components/ActionButtonBottom";
import { ServiceCreateRequest } from "@/types/service";
import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import { XStack, YStack, useTheme as useTamaguiTheme } from "tamagui";
import CalculatorMethodComponent from "./component/CalculatorMethodComponent";
import ServiceSelectedSearchComponent from "./component/ServiceSelectedSearchComponent";

const CreateTenantScreen = ({ navigation }: { navigation: any }) => {
  const theme = useTamaguiTheme();
  const styles = createStyles(theme);
  const uniqueId = useId();

  const [location, setLocation] = useState<ComboOption<string, string>[]>([]);
  const [cities, setCities] = useState<ComboOption<string, string>[]>([]);
  const [wards, setWards] = useState<ComboOption<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWard, setIsLoadingWard] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "provinceCode" | "districtCode" | "wardCode" | null
  >(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyCreateRequest>({
    defaultValues: {
      name: "",
      defaultRoomRent: 5000000,
      paymentDate: 5,
      services: [],
    },
  });

  const services = watch("services");

  useEffect(() => {
    featchData().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const featchData = async (): Promise<void> => {
    const responseProvince = await getComboProvinces();
    const responseServiceDefalt = await getServiceDefault();
    if (responseProvince.success && responseServiceDefalt.success) {
      setCities(responseProvince.data ?? []);
      const servicesDefault = responseServiceDefalt.data?.map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
        calculationMethod: service.calculationMethod,
        icon: service.icon,
      })) as ServiceCreateRequest[];

      setValue("services", servicesDefault);
    }
  };

  const getDistricts = async (provinceId: string) => {
    setIsLoadingDistricts(true);
    setIsLoadingWard(true);
    const response = await getComboDistricts(provinceId);
    if (response.success) {
      setLocation(response.data ?? []);
    } else {
      setLocation([]);
    }
    setWards([]);
    setIsLoadingDistricts(false);
    setIsLoadingWard(false);
  };

  const getWards = async (districtId: string) => {
    setIsLoadingWard(true);
    const response = await getComboWards(districtId);
    if (response.success) {
      setWards(response.data ?? []);
    }
    setIsLoadingWard(false);
  };

  const handleAddService = () => {
    const newService = {
      name: "",
      price: 0,
      id: generateId(),
      calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
      icon: "apps-outline",
    };
    setValue("services", [...(services ?? []), newService]);
  };

  const handleRemoveService = (index: number) => {
    const newServices = [...(services ?? [])];
    newServices.splice(index, 1);
    setValue("services", newServices);
  };

  const beforeSubmit = (data: PropertyCreateRequest) => {
    data.defaultRoomRent = Number(data.defaultRoomRent) ?? 0;
    data.paymentDate = Number(data.paymentDate) ?? 0;
    data?.services?.forEach((service) => {
      service.price = Number(service.price) ?? 0;
      if (service.calculationMethod === ServiceCalculateMethod.FREE) {
        service.price = 0;
      }
    });
    return data;
  };

  const onSubmit = (data: PropertyCreateRequest) => {
    setIsLoading(true);
    beforeSubmit(data);

    createProperty(data)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Tạo căn hộ thành công",
        });
        navigation.goBack();
      })
      .catch((errors) => {
        console.error("💞💓💗💞💓💗 ~ onSubmit ~ errors:", errors);
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Tạo căn hộ thất bại",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onError = (errors: FieldErrors<PropertyCreateRequest>) => {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableAutomaticScroll={true}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.background?.val }}
        >
          <YStack padding="$4" space="$4">
            <Controller
              control={control}
              name="name"
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
                  required={true}
                  onChange={(item) => {
                    onChange(item);
                    getDistricts(item);
                  }}
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
                  required={true}
                  options={location}
                  onChange={(item) => {
                    onChange(item);
                    getWards(item);
                  }}
                  placeholder="Chọn quận/huyện"
                  error={errors.districtCode?.message}
                  isLoading={isLoadingDistricts}
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
                  required={true}
                  onChange={onChange}
                  placeholder="Chọn phường/xã"
                  error={errors.wardCode?.message}
                  isLoading={isLoadingWard}
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

            <YStack space="$2">
              <Text style={styles.label}>Vị trí trên bản đồ</Text>
              <TouchableOpacity style={styles.mapButton}>
                <Ionicons name="map-outline" size={24} color="#007AFF" />
                <Text style={styles.mapButtonText}>
                  Chọn vị trí trên bản đồ
                </Text>
              </TouchableOpacity>
            </YStack>

            <Controller
              control={control}
              name="defaultRoomRent"
              rules={{ required: "Vui lòng nhập giá thuê mặc định" }}
              render={({ field: { onChange, value } }) => (
                <InputBase
                  label="Giá thuê mặc định"
                  required={true}
                  placeholder="Nhập giá thuê mặc định"
                  value={value ? formatCurrency(value.toString()) : ""}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    onChange(numericValue);
                  }}
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
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    const num = parseInt(numericValue);
                    if (!num) {
                      onChange(null);
                      return;
                    }
                    if (num >= 1 && num <= 31) {
                      onChange(num);
                    }
                  }}
                  keyboardType="numeric"
                  error={errors.paymentDate?.message}
                />
              )}
            />

            <XStack space="$4">
              <YStack space="$2" flex={1}>
                <Controller
                  control={control}
                  name="totalRoom"
                  rules={{ required: "Vui lòng nhập số phòng" }}
                  render={({ field: { onChange, value } }) => (
                    <InputBase
                      label="Số phòng"
                      required={true}
                      placeholder="Nhập số phòng"
                      value={value?.toString()}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, "");
                        const num = parseInt(numericValue);
                        if (!num) {
                          onChange(null);
                          return;
                        }
                        onChange(num);
                      }}
                      keyboardType="numeric"
                      error={errors.totalRoom?.message}
                    />
                  )}
                />
              </YStack>
              <YStack space="$2" flex={1}>
                <Controller
                  control={control}
                  name="numberFloor"
                  render={({ field: { onChange, value } }) => (
                    <InputBase
                      label="Số tầng"
                      placeholder="Nhập số tầng"
                      value={value ? value.toString() : ""}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, "");
                        const num = parseInt(numericValue);
                        if (!num) {
                          onChange(null);
                          return;
                        }
                        onChange(num);
                      }}
                      keyboardType="numeric"
                      error={errors.numberFloor?.message}
                    />
                  )}
                />
              </YStack>
            </XStack>

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
                  services.map((service, index) => (
                    <YStack
                      key={service.id}
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
                        onPress={() => handleRemoveService(index)}
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
                            render={({ field: { onChange, value } }) => {
                              return (
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
                                  error={
                                    errors.services?.[index]?.price?.message
                                  }
                                />
                              );
                            }}
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
                                  if (
                                    newMethod === ServiceCalculateMethod.FREE
                                  ) {
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
        </SafeAreaView>
      </KeyboardAwareScrollView>
      <View
        style={{
          padding: 16,
          paddingBottom: 32,
          backgroundColor: theme.background?.val ?? "#fff",
        }}
      >
        <ActionButtonBottom
          actions={[
            {
              label: "Tạo căn hộ",
              onPress: handleSubmit(onSubmit, onError),
              variant: "primary",
              isLoading: isLoading,
              icon: "checkmark-circle",
            },
          ]}
        />
      </View>
    </>
  );
};

export default CreateTenantScreen;
