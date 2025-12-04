import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Text, View } from "react-native";
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Input from "@/components/Input";
import ActionButtonBottom from "@/components/ActionButtonBottom";
import { stylesHeader } from "@/components/AppSheet/AppSheet";
import AppSheetBackdropComponent from "@/components/AppSheet/AppSheetBackdropComponent";
import AppSheetHandleComponent from "@/components/AppSheet/AppSheetHandleComponent";
import AppSheetHeader from "@/components/AppSheet/AppSheetHeader";
import { ClientCreateRequest } from "@/types/client";
import { Controller, useForm } from "react-hook-form";

interface CompanionClientComponentProps {
  onSuccess?: (client: ClientCreateRequest, index: number) => void;
}

export interface CompanionClientComponentRef {
  close: () => void;
  expand: (client: ClientCreateRequest, index: number) => void;
}

const CompanionClientComponent = forwardRef<
  CompanionClientComponentRef,
  CompanionClientComponentProps
>(({ onSuccess }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const styleHeader = stylesHeader;
  const [index, setIndex] = useState<number>(0);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClientCreateRequest>({
    defaultValues: {
      name: "",
      phone: "",
      isLandlordClient: false,
      isActive: true,
    },
  });

  useImperativeHandle(ref, () => ({
    close: () => {
      bottomSheetRef.current?.close();
    },
    expand: (client: ClientCreateRequest, idx: number) => {
      setIndex(idx);
      reset({
        name: client?.name || "",
        phone: client?.phone || "",
        idCardNumber: client?.idCardNumber,
        permanentAddress: client?.permanentAddress,
        isLandlordClient: false,
        isActive: true,
      });

      setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, 100);
    },
  }));

  const _renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <ActionButtonBottom
          actions={[
            {
              label: "Xác nhận",
              variant: "success",
              onPress: handleSubmit((value) => {
                onSuccess?.(
                  {
                    ...value,
                    isLandlordClient: false,
                    isActive: true,
                  },
                  index
                );
                bottomSheetRef.current?.close();
              }),
            },
          ]}
        />
      </BottomSheetFooter>
    ),
    [index]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <AppSheetBackdropComponent
        {...props}
        onBackdropPress={() => {
          bottomSheetRef.current?.close();
        }}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["80%"]}
      index={-1}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      enableOverDrag={false}
      handleComponent={AppSheetHandleComponent}
      enableHandlePanningGesture={true}
      detached={true}
      footerComponent={_renderFooter}
    >
      <View style={[styleHeader.fixedHeaderContainer, { height: 60 }]}>
        <AppSheetHeader
          title="Thông tin người ở cùng"
          onClose={() => {
            bottomSheetRef.current?.close();
          }}
        />
      </View>
      <BottomSheetScrollView
        className="p-4 mt-[60px] mb-[90px]"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        <View className="mb-3">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Họ và tên người ở cùng"
                value={value}
                onChangeText={onChange}
                placeholder="Nhập họ và tên (không bắt buộc)"
                icon="person-outline"
              />
            )}
          />
        </View>

        <View className="mb-3">
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Số điện thoại"
                value={value}
                type="number"
                maxLength={10}
                keyboardType="phone-pad"
                onChangeText={onChange}
                placeholder="Nhập số điện thoại (không bắt buộc)"
                icon="call-outline"
              />
            )}
          />
        </View>

        <View className="mb-3">
          <Controller
            control={control}
            name="idCardNumber"
            render={({ field: { onChange, value } }) => (
              <Input
                label="CCCD/CMND (tùy chọn)"
                value={value}
                maxLength={12}
                keyboardType="numeric"
                onChangeText={onChange}
                placeholder="Nhập CCCD/CMND nếu có"
                icon="card-outline"
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="permanentAddress"
          render={({ field: { onChange, value } }) => (
            <Input
              type="area"
              label="Địa chỉ thường trú (tùy chọn)"
              value={value}
              onChangeText={onChange}
              placeholder="Nhập địa chỉ thường trú"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          )}
        />

        <View className="mt-4 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <Text className="text-sm font-semibold text-emerald-700 mb-1">
            Gợi ý nhập thông tin
          </Text>
          <Text className="text-xs text-emerald-700">
            Bạn không bắt buộc phải nhập đầy đủ, nhưng nên có ít nhất họ tên
            hoặc số điện thoại để dễ quản lý sau này.
          </Text>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

CompanionClientComponent.displayName = "CompanionClientComponent";

export default CompanionClientComponent;


