import { ComboBox } from "@/components/ComboBox";
import InputBase from "@/components/Input";
import Loading from "@/components/Loading";
import { createStyles } from "@/styles/StyleCreateTenantScreent";
import { ComboOption } from "@/types/comboOption";
import React, { useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { useTheme as useTamaguiTheme, XStack, YStack } from "tamagui";

// Mock data mẫu
const mockProperty = {
  name: "Tòa nhà A",
  provinceCode: "01",
  districtCode: "001",
  wardCode: "00001",
  address: "123 Đường ABC, Quận 1",
  defaultRoomRent: 7000000,
  paymentDate: 5,
  numberFloor: 5,
  services: [
    {
      index: 0,
      name: "Nước",
      price: 10000,
      calculationMethod: "PER_UNIT_SIMPLE",
    },
    {
      index: 1,
      name: "Điện",
      price: 3500,
      calculationMethod: "PER_UNIT_SIMPLE",
    },
    {
      index: 2,
      name: "Wifi",
      price: 150000,
      calculationMethod: "FIXED_PER_ROOM",
    },
  ],
};

type UpdateTenantScreenProps = {
  navigation: any;
};

type ServiceType = {
  index: number;
  name: string;
  price: number;
  calculationMethod: string;
};

const UpdateTenantScreen = ({ navigation }: UpdateTenantScreenProps) => {
  const theme = useTamaguiTheme();
  const styles = createStyles(theme);

  // Mock options cho ComboBox
  const cities: ComboOption<string, string>[] = [
    { key: "01", label: "Hà Nội", value: "01" },
    { key: "79", label: "Hồ Chí Minh", value: "79" },
  ];
  const districts: ComboOption<string, string>[] = [
    { key: "001", label: "Quận 1", value: "001" },
    { key: "002", label: "Quận 2", value: "002" },
  ];
  const wards: ComboOption<string, string>[] = [
    { key: "00001", label: "Phường A", value: "00001" },
    { key: "00002", label: "Phường B", value: "00002" },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "provinceCode" | "districtCode" | "wardCode" | null
  >(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: mockProperty,
  });

  const services: ServiceType[] = watch("services");

  const handleAddService = () => {
    const currentServices: ServiceType[] = watch("services");
    setValue("services", [
      ...currentServices,
      {
        index: currentServices.length,
        name: "",
        price: 0,
        calculationMethod: "FIXED_PER_ROOM",
      },
    ]);
  };

  const handleRemoveService = (index: number) => {
    const currentServices: ServiceType[] = watch("services");
    setValue(
      "services",
      currentServices.filter((service) => service.index !== index)
    );
  };

  const onSubmit = (data: typeof mockProperty) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Cập nhật tòa nhà thành công!",
      });
      navigation.goBack && navigation.goBack();
    }, 1000);
  };

  const onError = (errors: FieldErrors) => {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
  };

  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }}>
      <ScrollView>
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
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>X</Text>
                  </TouchableOpacity>
                  <XStack space="$2" alignItems="center">
                    <YStack space="$2" flex={1}>
                      <Controller
                        control={control}
                        name={`services.${service.index}.name`}
                        render={({ field: { onChange, value } }) => (
                          <InputBase
                            placeholder="Tên dịch vụ"
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`services.${service.index}.price`}
                        rules={{ required: "Vui lòng nhập giá dịch vụ" }}
                        render={({ field: { onChange, value } }) => (
                          <InputBase
                            placeholder="Giá"
                            value={value?.toString()}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            error={
                              errors.services?.[service.index]?.price?.message
                            }
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`services.${service.index}.calculationMethod`}
                        render={({ field: { onChange, value } }) => (
                          <InputBase
                            placeholder="Cách tính tiền (ví dụ: PER_UNIT_SIMPLE)"
                            value={value}
                            onChangeText={onChange}
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
        <YStack padding="$4">
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit, onError)}
          >
            <XStack space="$2" alignItems="center">
              <Text style={styles.submitButtonText}>Cập nhật tòa nhà</Text>
            </XStack>
          </TouchableOpacity>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateTenantScreen;
