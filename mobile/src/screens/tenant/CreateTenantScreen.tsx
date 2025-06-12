import {
  getComboDistricts,
  getComboProvinces,
  getComboWards,
} from "@/api/location/location.api";
import { createProperty } from "@/api/property/property.api";
import { ComboBox } from "@/components/ComboBox";
import {
  SERVICE_CALCULATE_METHOD_WITH_INFO,
  ServiceCalculateMethod,
} from "@/constant/service.constant";
import { createStyles } from "@/styles/StyleCreateTenantScreent";
import { ComboOption } from "@/types/comboOption";
import { PropertyCreateRequest } from "@/types/property";
import { formatCurrency } from "@/utils/appUtil";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Input,
  TextArea,
  XStack,
  YStack,
  useTheme as useTamaguiTheme,
} from "tamagui";

const CreateTenantScreen = () => {
  const navigation = useNavigation();
  const theme = useTamaguiTheme();
  const styles = createStyles(theme);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState<ComboOption<string, string>[]>([]);
  const [cities, setCities] = useState<ComboOption<string, string>[]>([]);
  const [wards, setWards] = useState<ComboOption<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWard, setIsLoadingWard] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "provinceCode" | "districtCode" | "wardCode" | null
  >(null);

  useEffect(() => {
    getProvinces().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const getProvinces = async () => {
    const response = await getComboProvinces();
    if (response.success) {
      setCities(response.data ?? []);
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
      services: [
        {
          index: 0,
          name: "Nước",
          price: 0,
          calculationMethod: ServiceCalculateMethod.PER_UNIT_SIMPLE,
        },
        {
          index: 1,
          name: "Điện",
          price: 0,
          calculationMethod: ServiceCalculateMethod.PER_UNIT_SIMPLE,
        },
        {
          index: 2,
          name: "Wifi",
          price: 0,
          calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
        },
        // {
        //   index: 3,
        //   name: "Gửi xe",
        //   price: 0,
        //   calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
        // },
      ],
    },
  });

  const services = watch("services");

  const handleAddService = () => {
    const currentServices = watch("services");
    setValue("services", [
      ...currentServices,
      {
        index: currentServices.length,
        name: "",
        price: 0,
        calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
      },
    ]);
  };

  const handleRemoveService = (index: number) => {
    const currentServices = watch("services");
    setValue(
      "services",
      currentServices.filter((service) => service.index !== index)
    );
  };

  const handlePriceTypeChange = (
    index: number,
    calculationMethod: ServiceCalculateMethod
  ) => {
    const currentServices = watch("services");
    setValue(
      "services",
      currentServices.map((service) =>
        service.index === index
          ? {
              ...service,
              calculationMethod,
              price: 0,
            }
          : service
      )
    );
  };

  const onSubmit = (data: PropertyCreateRequest) => {
    setIsLoading(true);
    createProperty(data)
      .finally(() => {
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((errors) => {
        console.log("💞💓💗💞💓💗 ~ onSubmit ~ errors:", errors);
      });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a5af9" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }}>
      <ScrollView>
        <YStack padding="$4" space="$4">
          <YStack space="$2">
            <Text style={styles.label}>Tên gợi nhớ</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nhập tên gợi nhớ (không bắt buộc)"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </YStack>

          <YStack space="$2">
            <Text style={styles.label}>
              Thành phố/Tỉnh <Text style={styles.requiredText}>*</Text>
            </Text>
            <Controller
              control={control}
              name="provinceCode"
              rules={{ required: "Vui lòng chọn thành phố/tỉnh" }}
              render={({ field: { onChange, value } }) => (
                <ComboBox
                  value={value}
                  options={cities}
                  onChange={(item) => {
                    onChange(item);
                    getDistricts(item);
                  }}
                  placeholder="Chọn thành phố/tỉnh"
                  error={errors.provinceCode?.message}
                  onFocus={() => setActiveDropdown("provinceCode")}
                  isActive={activeDropdown === "provinceCode"}
                />
              )}
            />
          </YStack>

          <YStack space="$2">
            <Text style={styles.label}>
              Quận/Huyện <Text style={styles.requiredText}>*</Text>
            </Text>
            <Controller
              control={control}
              name="districtCode"
              rules={{ required: "Vui lòng chọn quận/huyện" }}
              render={({ field: { onChange, value } }) => (
                <ComboBox
                  value={value}
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
                />
              )}
            />
          </YStack>

          <YStack space="$2">
            <Text style={styles.label}>
              Phường/Xã <Text style={styles.requiredText}>*</Text>
            </Text>
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
                  isLoading={isLoadingWard}
                  onFocus={() => setActiveDropdown("wardCode")}
                  isActive={activeDropdown === "wardCode"}
                />
              )}
            />
          </YStack>

          <YStack space="$2">
            <Text style={styles.label}>
              Địa chỉ chi tiết <Text style={styles.requiredText}>*</Text>
            </Text>
            <Controller
              control={control}
              name="address"
              rules={{ required: "Vui lòng nhập địa chỉ chi tiết" }}
              render={({ field: { onChange, value } }) => (
                <TextArea
                  placeholder="Nhập địa chỉ chi tiết"
                  value={value}
                  onChangeText={onChange}
                  numberOfLines={3}
                  backgroundColor="#fff"
                  borderWidth={1}
                  borderColor={errors.address ? "#ff3b30" : "#ddd"}
                  borderRadius={8}
                  padding={12}
                  fontSize={16}
                  minHeight={100}
                />
              )}
            />
          </YStack>

          <YStack space="$2">
            <Text style={styles.label}>Vị trí trên bản đồ</Text>
            <TouchableOpacity style={styles.mapButton}>
              <Ionicons name="map-outline" size={24} color="#007AFF" />
              <Text style={styles.mapButtonText}>Chọn vị trí trên bản đồ</Text>
            </TouchableOpacity>
          </YStack>

          <YStack space="$2">
            <Text style={styles.label}>
              Giá thuê mặc định <Text style={styles.requiredText}>*</Text>
            </Text>
            <Controller
              control={control}
              name="defaultRoomRent"
              rules={{ required: "Vui lòng nhập giá thuê mặc định" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nhập giá thuê mặc định"
                  value={value ? formatCurrency(value.toString()) : ""}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    onChange(numericValue);
                  }}
                  keyboardType="numeric"
                  borderColor={errors.defaultRoomRent ? "#ff3b30" : "#ddd"}
                />
              )}
            />
          </YStack>

          <YStack space="$2">
            <Text style={styles.label}>
              Ngày thanh toán mặc định{" "}
              <Text style={styles.requiredText}>*</Text>
            </Text>
            <Controller
              control={control}
              name="paymentDate"
              rules={{ required: "Vui lòng nhập ngày thanh toán" }}
              render={({ field: { onChange, value } }) => (
                <Input
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
                  borderColor={errors.paymentDate ? "#ff3b30" : "#ddd"}
                />
              )}
            />
          </YStack>

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
              {services.map((service, index) => (
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
                    onPress={() => handleRemoveService(service.index)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                  <XStack space="$2" alignItems="center">
                    <YStack space="$2" flex={1}>
                      <Controller
                        control={control}
                        name={`services.${service.index}.name`}
                        render={({ field: { onChange, value } }) => (
                          <View style={{ position: "relative" }}>
                            <Input
                              placeholder="Tên dịch vụ"
                              value={value}
                              onChangeText={onChange}
                              paddingLeft={40}
                            />
                            <View
                              style={{
                                position: "absolute",
                                left: 12,
                                top: 0,
                                bottom: 0,
                                justifyContent: "center",
                              }}
                            >
                              <Ionicons
                                name={
                                  service.name === "Điện"
                                    ? "flash-outline"
                                    : service.name === "Nước"
                                    ? "water-outline"
                                    : service.name === "Wifi"
                                    ? "wifi-outline"
                                    : service.name === "Gửi xe"
                                    ? "car-outline"
                                    : "apps-outline"
                                }
                                size={20}
                                color="#007AFF"
                              />
                            </View>
                          </View>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`services.${service.index}.price`}
                        rules={{ required: "Vui lòng nhập giá dịch vụ" }}
                        render={({ field: { onChange, value } }) => (
                          <Input
                            placeholder="Giá"
                            disabled={
                              service.calculationMethod ===
                              ServiceCalculateMethod.FREE
                            }
                            value={
                              service.calculationMethod ===
                              ServiceCalculateMethod.FREE
                                ? "0"
                                : value
                                ? formatCurrency(value.toString())
                                : ""
                            }
                            onChangeText={(text) => {
                              const numericValue = text.replace(/[^0-9]/g, "");
                              onChange(numericValue);
                            }}
                            keyboardType="numeric"
                            borderColor={
                              errors.services?.[service.index]?.price
                                ? "#ff3b30"
                                : "#ddd"
                            }
                          />
                        )}
                      />
                      {errors.services?.[service.index]?.price && (
                        <Text style={styles.errorText}>
                          {errors.services[service.index]?.price?.message}
                        </Text>
                      )}
                      <Controller
                        control={control}
                        name={`services.${service.index}.calculationMethod`}
                        render={({ field: { onChange, value } }) => {
                          const [isExpanded, setIsExpanded] = useState(false);

                          return (
                            <YStack space="$2">
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    marginTop: 12,
                                    marginBottom: 0,
                                    textAlign: "center",
                                  },
                                ]}
                              >
                                Cách tính tiền
                              </Text>
                              <YStack space="$2">
                                <TouchableOpacity
                                  style={[
                                    styles.calculationMethodButton,
                                    styles.calculationMethodButtonActive,
                                  ]}
                                  onPress={() => onChange(value)}
                                >
                                  <XStack
                                    space="$3"
                                    alignItems="center"
                                    flex={1}
                                  >
                                    <Ionicons
                                      name={
                                        SERVICE_CALCULATE_METHOD_WITH_INFO[
                                          value
                                        ].icon
                                      }
                                      size={20}
                                      color="#fff"
                                    />
                                    <Text
                                      style={[
                                        styles.methodTitle,
                                        styles.methodTitleActive,
                                      ]}
                                    >
                                      {
                                        SERVICE_CALCULATE_METHOD_WITH_INFO[
                                          value
                                        ].label
                                      }
                                    </Text>
                                  </XStack>
                                  <TouchableOpacity
                                    style={styles.methodDetailButton}
                                    onPress={() => {
                                      Alert.alert(
                                        "Thông tin",
                                        SERVICE_CALCULATE_METHOD_WITH_INFO[
                                          value
                                        ].info
                                      );
                                    }}
                                  >
                                    <Ionicons
                                      name="information-circle-outline"
                                      size={20}
                                      color="#fff"
                                    />
                                  </TouchableOpacity>
                                </TouchableOpacity>

                                {isExpanded && (
                                  <>
                                    {Object.values(ServiceCalculateMethod)
                                      .filter((method) => method !== value)
                                      .map((method) => (
                                        <TouchableOpacity
                                          key={method}
                                          style={[
                                            styles.calculationMethodButton,
                                          ]}
                                          onPress={() => onChange(method)}
                                        >
                                          <XStack
                                            space="$3"
                                            alignItems="center"
                                            flex={1}
                                          >
                                            <Ionicons
                                              name={
                                                SERVICE_CALCULATE_METHOD_WITH_INFO[
                                                  method
                                                ].icon
                                              }
                                              size={20}
                                              color="#007AFF"
                                            />
                                            <Text style={[styles.methodTitle]}>
                                              {
                                                SERVICE_CALCULATE_METHOD_WITH_INFO[
                                                  method
                                                ].label
                                              }
                                            </Text>
                                          </XStack>
                                          <TouchableOpacity
                                            style={styles.methodDetailButton}
                                            onPress={() => {
                                              Alert.alert(
                                                "Thông tin",
                                                SERVICE_CALCULATE_METHOD_WITH_INFO[
                                                  method
                                                ].info
                                              );
                                            }}
                                          >
                                            <Ionicons
                                              name="information-circle-outline"
                                              size={20}
                                              color="#666"
                                            />
                                          </TouchableOpacity>
                                        </TouchableOpacity>
                                      ))}
                                  </>
                                )}

                                <TouchableOpacity
                                  style={styles.expandButton}
                                  onPress={() => setIsExpanded(!isExpanded)}
                                >
                                  <XStack
                                    space="$2"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <Text style={styles.expandButtonText}>
                                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                                    </Text>
                                    <Ionicons
                                      name={
                                        isExpanded
                                          ? "chevron-up"
                                          : "chevron-down"
                                      }
                                      size={16}
                                      color="#007AFF"
                                    />
                                  </XStack>
                                </TouchableOpacity>
                              </YStack>
                            </YStack>
                          );
                        }}
                      />
                    </YStack>
                  </XStack>
                </YStack>
              ))}
            </YStack>
          </YStack>
        </YStack>
        <YStack padding="$4">
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            <XStack space="$2" alignItems="center">
              <Text style={styles.submitButtonText}>Tạo căn hộ</Text>
            </XStack>
          </TouchableOpacity>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateTenantScreen;
