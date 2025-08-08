import ActionButtonBottom from "@/components/ActionButtonBottom";
import InputBase from "@/components/Input";
import Loading from "@/components/Loading";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { Alert, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import { YStack, useTheme as useTamaguiTheme } from "tamagui";
import { RootStackParamList } from "../../navigation/types";

// Placeholder tenant type - should be defined in types
interface TenantUpdateRequest {
  name: string;
  email: string;
  phone: string;
  identityNumber: string;
  address: string;
}

type UpdateTenantScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "UpdateTenant">;
  route: RouteProp<RootStackParamList, "UpdateTenant">;
};

const UpdateTenantScreen = ({ navigation, route }: UpdateTenantScreenProps) => {
  const theme = useTamaguiTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<TenantUpdateRequest>();
  const { tenantId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Implement actual API call to get tenant data
      setTimeout(() => {
        // Mock data
        setInitialData({
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          phone: "0123456789",
          identityNumber: "123456789",
          address: "123 Đường ABC, Quận 1, TP.HCM",
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, [tenantId]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantUpdateRequest>({
    values: initialData,
  });

  const onSubmit = (data: TenantUpdateRequest) => {
    setIsLoading(true);

    // TODO: Implement actual API call
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Cập nhật khách thuê thành công",
      });
      navigation.goBack();
      setIsLoading(false);
    }, 1000);
  };

  const onError = (errors: FieldErrors<TenantUpdateRequest>) => {
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
              rules={{ required: "Vui lòng nhập họ tên" }}
              render={({ field: { onChange, value } }) => (
                <InputBase
                  placeholder="Nhập họ tên đầy đủ"
                  value={value}
                  onChangeText={onChange}
                  label="Họ và tên"
                  required={true}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputBase
                  placeholder="Nhập địa chỉ email"
                  value={value}
                  onChangeText={onChange}
                  label="Email"
                  required={true}
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              rules={{
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputBase
                  placeholder="Nhập số điện thoại"
                  value={value}
                  onChangeText={onChange}
                  label="Số điện thoại"
                  required={true}
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="identityNumber"
              rules={{
                required: "Vui lòng nhập CCCD/CMND",
                pattern: {
                  value: /^[0-9]{9,12}$/,
                  message: "CCCD/CMND không hợp lệ",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputBase
                  placeholder="Nhập số CCCD/CMND"
                  value={value}
                  onChangeText={onChange}
                  label="CCCD/CMND"
                  required={true}
                  keyboardType="numeric"
                  error={errors.identityNumber?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="address"
              rules={{ required: "Vui lòng nhập địa chỉ" }}
              render={({ field: { onChange, value } }) => (
                <InputBase
                  placeholder="Nhập địa chỉ thường trú"
                  value={value}
                  onChangeText={onChange}
                  required={true}
                  type="area"
                  numberOfLines={3}
                  label="Địa chỉ thường trú"
                  error={errors.address?.message}
                />
              )}
            />
          </YStack>
        </ScrollView>
      </KeyboardAwareScrollView>
      <ActionButtonBottom
        actions={[
          {
            label: "Cập nhật khách thuê",
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
