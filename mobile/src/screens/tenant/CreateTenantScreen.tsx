import { getComboDistricts, getComboProvinces } from "@/api/location/api";
import { ComboBox } from "@/components/ComboBox";
import { createStyles } from "@/styles/StyleCreateTenantScreent";
import { ComboOption } from "@/types/comboOption";
import { formatCurrency } from "@/utils/appUtil";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
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

interface FormData {
  name: string;
  city: number;
  paymentDate: number;
  district: string;
  address: string;
  defaultPrice: string;
  services: Array<{
    id: number;
    name: string;
    price: string;
    priceType: "fixed" | "perUnit";
  }>;
}

const CreateTenantScreen = () => {
  const theme = useTamaguiTheme();
  const styles = createStyles(theme);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState<ComboOption<number, string>[]>([]);
  const [cities, setCities] = useState<ComboOption<number, string>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "city" | "district" | null
  >(null);

  useEffect(() => {
    getProvinces();
  }, []);

  const getProvinces = async () => {
    const response = await getComboProvinces();
    if (response.success) {
      setIsLoading(false);
      setCities(response.data ?? []);
    }
  };

  const getDistricts = async (provinceId: number) => {
    setIsLoadingDistricts(true);
    const response = await getComboDistricts(provinceId);
    if (response.success) {
      setLocation(response.data ?? []);
    }
    setIsLoadingDistricts(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      defaultPrice: "",
      paymentDate: 5,
      services: [
        { id: 2, name: "Nước", price: "", priceType: "fixed" },
        { id: 1, name: "Điện", priceType: "fixed" },
        { id: 3, name: "Wifi", price: "", priceType: "fixed" },
        { id: 4, name: "Gửi xe", price: "", priceType: "fixed" },
      ],
    },
  });

  const services = watch("services");

  const handleAddService = () => {
    const currentServices = watch("services");
    setValue("services", [
      ...currentServices,
      {
        id: currentServices.length + 1,
        name: "",
        price: "",
        priceType: "fixed",
      },
    ]);
  };

  const handleRemoveService = (id: number) => {
    const currentServices = watch("services");
    setValue(
      "services",
      currentServices.filter((service) => service.id !== id)
    );
  };

  const handlePriceTypeChange = (
    id: number,
    priceType: "fixed" | "perUnit"
  ) => {
    const currentServices = watch("services");
    setValue(
      "services",
      currentServices.map((service) =>
        service.id === id ? { ...service, priceType, price: "" } : service
      )
    );
  };

  const onSubmit = (data: FormData) => {
    console.log({
      ...data,
      location,
      images,
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
              name="city"
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
                  error={errors.city?.message}
                  onFocus={() => setActiveDropdown("city")}
                  isActive={activeDropdown === "city"}
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
              name="district"
              rules={{ required: "Vui lòng chọn quận/huyện" }}
              render={({ field: { onChange, value } }) => (
                <ComboBox
                  value={value}
                  options={location}
                  onChange={onChange}
                  placeholder="Chọn quận/huyện"
                  error={errors.district?.message}
                  isLoading={isLoadingDistricts}
                  onFocus={() => setActiveDropdown("district")}
                  isActive={activeDropdown === "district"}
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
              name="defaultPrice"
              rules={{ required: "Vui lòng nhập giá thuê mặc định" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nhập giá thuê mặc định"
                  value={value ? formatCurrency(value) : ""}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    onChange(numericValue);
                  }}
                  keyboardType="numeric"
                  borderColor={errors.defaultPrice ? "#ff3b30" : "#ddd"}
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
              {services.map((service) => (
                <YStack
                  key={service.id}
                  space="$2"
                  backgroundColor="#fff"
                  padding="$3"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="#e9ecef"
                  marginBottom="$2"
                >
                  <XStack space="$2" alignItems="center">
                    <View style={styles.serviceIconContainer}>
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
                    <YStack space="$2" flex={1}>
                      <Controller
                        control={control}
                        name={`services.${service.id - 1}.name`}
                        render={({ field: { onChange, value } }) => (
                          <Input
                            placeholder="Tên dịch vụ"
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`services.${service.id - 1}.price`}
                        rules={{ required: "Vui lòng nhập giá dịch vụ" }}
                        render={({ field: { onChange, value } }) => (
                          <Input
                            placeholder="Giá"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            borderColor={
                              errors.services?.[service.id - 1]?.price
                                ? "#ff3b30"
                                : "#ddd"
                            }
                          />
                        )}
                      />
                      {errors.services?.[service.id - 1]?.price && (
                        <Text style={styles.errorText}>
                          {errors.services[service.id - 1]?.price?.message}
                        </Text>
                      )}
                      <Controller
                        control={control}
                        name={`services.${service.id - 1}.priceType`}
                        render={({ field: { onChange, value } }) => (
                          <View style={styles.priceTypeContainer}>
                            <TouchableOpacity
                              style={[
                                styles.priceTypeButton,
                                value === "fixed" &&
                                  styles.priceTypeButtonActive,
                              ]}
                              onPress={() => onChange("fixed")}
                            >
                              <Text
                                style={[
                                  styles.priceTypeButtonText,
                                  value === "fixed" &&
                                    styles.priceTypeButtonTextActive,
                                ]}
                              >
                                Cố định
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.priceTypeButton,
                                value === "perUnit" &&
                                  styles.priceTypeButtonActive,
                              ]}
                              onPress={() => onChange("perUnit")}
                            >
                              <Text
                                style={[
                                  styles.priceTypeButtonText,
                                  value === "perUnit" &&
                                    styles.priceTypeButtonTextActive,
                                ]}
                              >
                                Theo đơn vị
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    </YStack>
                    <TouchableOpacity
                      style={styles.removeServiceButton}
                      onPress={() => handleRemoveService(service.id)}
                    >
                      <Ionicons name="close" size={20} color="#666" />
                    </TouchableOpacity>
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
