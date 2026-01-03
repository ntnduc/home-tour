import { getContract } from '@/api/contract/contract.api';
import ActionButtonBottom from '@/components/ActionButtonBottom';
import { ComboBox } from '@/components/ComboBox';
import DatePicker from '@/components/DatePicker';
import DisplayField from '@/components/DisplayField';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import { RootStackParamList } from '@/navigation/types';
import { ContractDetailResponse } from '@/types/contract';
import { ContractServiceInvoiceCalculateResponse } from '@/types/contract-service';
import {
  InvoiceCreateRequest,
  InvoiceDetailResponse,
  InvoiceStatus,
} from '@/types/invoice';
import { formatCurrency } from '@/utils/appUtil';
import {
  getCurrentDate,
  getNextMonth,
  getNextMonthDate,
} from '@/utils/dateUtil';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import CardComponent from '../common/CardComponent';
import ServiceInvoiceItem from './components/ServiceInvoiceItem';

type UtilityService = {
  id: string;
  name: string;
  unit: string;
  unitPrice: number;
  oldIndex: string;
  newIndex: string;
  allowEditOld?: boolean;
};

type CreateInvoiceScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateInvoice'>;
  route: { params: RootStackParamList['CreateInvoice'] };
};

const CreateInvoiceScreen = ({
  navigation,
  route,
}: CreateInvoiceScreenProps) => {
  const { contractId, roomId } = route.params || {};

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isLoading },
  } = useForm<InvoiceCreateRequest>({
    defaultValues: async () => {
      const response = await getContract(contractId || '');
      if (!response.success && !response.data) {
        if (response.message) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: response.message ?? 'Không thể tải thông tin hợp đồng',
          });
        }
        navigation.goBack();
        return {} as InvoiceCreateRequest;
      }

      const contract = response.data as ContractDetailResponse;
      // Check date payment default is valid
      const currentDate = getNextMonthDate();
      const maxDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0,
      ).getDate();
      const dueDate = new Date(
        currentDate.setDate(
          contract.paymentDueDay && contract.paymentDueDay <= maxDayOfMonth
            ? contract.paymentDueDay
            : maxDayOfMonth,
        ),
      );

      const invoiceDetail: InvoiceDetailResponse = {
        contractId: contract.id,
        roomName: contract?.room?.name || '',
        roomId: contract.roomId,
        billingPeriodStart: new Date(),
        billingPeriodEnd: new Date(),
        dueDate: dueDate,
        clientName:
          contract.contractClient.find((c) => c.isLandlordClient)?.name || '',
        notes: '',
        isPrepaid: false,
        totalAmount: contract.rentAmountAgreed,
        paidAmount: 0,
        remainingAmount: 0,
        contractServices: contract.contractServices?.map((item) => ({
          ...item,
          newHelperValue: 0,
          oldHelperValue: item.helperValue ?? 0,
          isUpdated: false,
        })),
        paymentMonth: contract.isPrepaidRoom
          ? getNextMonth()
          : getCurrentDate().getMonth(),
        status: InvoiceStatus.DRAFT,
      };
      return invoiceDetail;
    },
  });

  const contractServices = watch(
    'contractServices',
  ) as ContractServiceInvoiceCalculateResponse[];

  const handleSave = async (data: InvoiceDetailResponse) => {
    // Navigate to confirm screen with invoice data
    navigation.navigate('ConfirmCreateInvoice', {
      invoice: data,
    });
  };

  const handleConfirmEditOld = (index: number) => {
    const service = contractServices[index];
    if (!service) {
      return;
    }

    const isUpdate = getValues(`contractServices.${index}.isUpdated`);
    if (!isUpdate) {
      Alert.alert(
        'Chỉnh sửa chỉ số cũ',
        'Bạn chắc chắn muốn sửa chỉ số cũ? Hãy đảm bảo ghi nhận đúng số trước đó.',
        [
          { text: 'Huỷ', style: 'cancel' },
          {
            text: 'Đồng ý',
            style: 'destructive',
            onPress: () => {
              setValue(`contractServices.${index}.isUpdated`, true);
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Hủy và đặt lại',
        'Bạn chắc chắn muốn hủy và đặt lại chỉ số cũ?',
        [
          { text: 'Huỷ', style: 'cancel' },
          {
            text: 'Đồng ý',
            style: 'destructive',
            onPress: () => {
              setValue(`contractServices.${index}.isUpdated`, false);
              setValue(
                `contractServices.${index}.oldHelperValue`,
                service.helperValue,
              );
            },
          },
        ],
      );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardOpeningTime={0}
        enableAutomaticScroll={true}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="gap-y-4"
      >
        <CardComponent title="Thông tin hợp đồng">
          <Controller
            control={control}
            name={'roomName'}
            render={({ field: { onChange, value } }) => (
              <DisplayField label="Phòng" value={value} strong />
            )}
          />
          <Controller
            control={control}
            name={'clientName'}
            render={({ field: { onChange, value } }) => (
              <DisplayField label="Người thuê" value={value} />
            )}
          />
          <Controller
            control={control}
            name={'totalAmount'}
            render={({ field: { onChange, value } }) => (
              <DisplayField
                label="Tiền thuê"
                value={formatCurrency(value)}
                valueClassName="text-3xl font-bold text-blue-600"
              />
            )}
          />
          {/* <View className="items-center pt-4 border-t border-gray-200">
            <Text className="text-sm text-gray-500 mb-2">Tổng cộng</Text>
            <Text className="text-3xl font-bold text-blue-600">
              123
            </Text>
            <View className="mt-2 flex-row items-center">
              <Text className="text-sm text-gray-500 mr-2">Còn lại: </Text>
              <Text className="text-base font-semibold text-red-600">
                2321
              </Text>
            </View>
          </View> */}
        </CardComponent>

        <CardComponent title="Thông tin thanh toán">
          <View className="gap-y-3">
            <Controller
              control={control}
              rules={{ required: 'Vui lòng chọn tháng thanh toán' }}
              name={'paymentMonth'}
              render={({ field: { onChange, value } }) => {
                return (
                  <ComboBox
                    label="Hóa đơn tháng:"
                    required={true}
                    isSearch={false}
                    options={Array.from({ length: 12 }, (_, index) => ({
                      key: index + 1,
                      value: index + 1,
                      label: `Tháng ${index + 1}`,
                    }))}
                    onChange={onChange}
                    value={value}
                    placeholder="Chọn tháng thanh toán"
                  />
                );
              }}
            />

            <Controller
              control={control}
              name={'dueDate'}
              rules={{
                required: 'Vui lòng chọn ngày thanh toán',
                validate: (value: Date) => {
                  const currentDate = getCurrentDate();
                  // if (value.getDate() < currentDate.getDate()) {
                  //   return 'Ngày thanh toán phải trong tương lai';
                  // }
                  return true;
                },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <DatePicker
                    error={error?.message}
                    label="Hạn thanh toán"
                    value={value}
                    onChange={onChange}
                    required
                  />
                );
              }}
            />
            <Controller
              control={control}
              name={'notes'}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Ghi chú"
                  value={value}
                  onChangeText={onChange}
                  type="area"
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              )}
            />
          </View>
        </CardComponent>

        <CardComponent title="Thông tin dịch vụ">
          <View className="gap-y-3">
            {contractServices.map((service, index) => (
              <ServiceInvoiceItem
                key={index}
                control={control}
                service={service}
                index={index}
                handleConfirmEditOld={handleConfirmEditOld}
                getValues={getValues}
              />
            ))}
          </View>
        </CardComponent>
      </KeyboardAwareScrollView>
      <ActionButtonBottom
        actions={[
          {
            label: 'Tạo hóa đơn',
            icon: 'checkmark-circle',
            // isLoading: isSubmitting,
            onPress: handleSubmit(handleSave, (errors) => {
              Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập đầy đủ thông tin!',
              });
            }),
          },
        ]}
      />
    </>
  );

  // useEffect(() => {
  //   fetchContracts();
  // }, [roomId]);

  // useEffect(() => {
  //   if (contractId) {
  //     setValue("contractId", contractId);
  //     fetchContractDetails(contractId);
  //   }
  // }, [contractId]);

  // useEffect(() => {
  //   if (selectedContractId && contracts.length > 0) {
  //     const contract = contracts.find((c) => c.id === selectedContractId);
  //     if (contract) {
  //       setSelectedContract(contract);
  //       fetchContractDetails(contract.id);
  //     }
  //   }
  // }, [selectedContractId, contracts]);

  // useEffect(() => {
  //   if (billingPeriodStart && selectedContract) {
  //     calculateBillingPeriod();
  //   }
  // }, [billingPeriodStart, isPrepaid, selectedContract]);

  // const fetchContracts = async () => {
  //   try {
  //     setIsLoading(true);
  //     // Simulate API delay
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     if (roomId) {
  //       // Use mock data instead of API call
  //       const mockContracts = createMockContracts(roomId).filter(
  //         (c) => c.status === ContractStatus.ACTIVE
  //       );
  //       setContracts(mockContracts);

  //       if (mockContracts.length === 1) {
  //         setValue("contractId", mockContracts[0].id);
  //         setSelectedContract(mockContracts[0]);
  //       }
  //     } else {
  //       // If no roomId, still show mock data for demo
  //       const mockContracts = createMockContracts().filter(
  //         (c) => c.status === ContractStatus.ACTIVE
  //       );
  //       setContracts(mockContracts);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching contracts:", error);
  //     Toast.show({
  //       type: "error",
  //       text1: "Lỗi",
  //       text2: "Không thể tải danh sách hợp đồng",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchContractDetails = async (id: string) => {
  //   try {
  //     // Simulate API delay
  //     await new Promise((resolve) => setTimeout(resolve, 300));

  //     // Use mock data instead of API call
  //     const mockContracts = createMockContracts(roomId);
  //     const contract = mockContracts.find((c) => c.id === id);
  //     if (contract) {
  //       setSelectedContract(contract);
  //       initializeUtilityReadings(contract.contractServices);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching contract details:", error);
  //   }
  // };

  // const initializeUtilityReadings = (
  //   services: ContractServiceDetailResponse[]
  // ) => {
  //   const utilityServices = services.filter(
  //     (s) =>
  //       s.calculationMethod === ServiceCalculateMethod.PER_UNIT_SIMPLE &&
  //       s.isEnabled
  //   );

  //   const readings: UtilityReadingForm[] = utilityServices.map((service) => ({
  //     serviceId: service.serviceId || service.id,
  //     serviceName: service.name,
  //     readingValue: "",
  //     previousReadingValue: "",
  //     calculationMethod: service.calculationMethod,
  //   }));

  //   setUtilityReadings(readings);

  //   // Fetch latest readings using mock data
  //   readings.forEach(async (reading) => {
  //     try {
  //       // Simulate API delay
  //       await new Promise((resolve) => setTimeout(resolve, 200));

  //       // Use mock data instead of API call
  //       const mockReading = createMockLatestReadings(
  //         selectedContract?.roomId || "",
  //         reading.serviceId
  //       );
  //       if (mockReading) {
  //         setUtilityReadings((prev) =>
  //           prev.map((r) =>
  //             r.serviceId === reading.serviceId
  //               ? {
  //                   ...r,
  //                   previousReadingValue: "",
  //                 }
  //               : r
  //           )
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching latest reading:", error);
  //     }
  //   });
  // };

  // const calculateBillingPeriod = () => {
  //   if (!billingPeriodStart || !selectedContract) return;

  //   try {
  //     const startDate = new Date(billingPeriodStart);
  //     if (isNaN(startDate.getTime())) return;

  //     // Calculate end date: start date + 1 month - 1 day
  //     const endDate = new Date(startDate);
  //     endDate.setMonth(endDate.getMonth() + 1);
  //     endDate.setDate(endDate.getDate() - 1);

  //     const endDateStr = endDate.toISOString().split("T")[0];
  //     setValue("billingPeriodEnd", endDateStr);

  //     // Calculate due date based on payment type
  //     const dueDate = new Date(startDate);
  //     if (isPrepaid) {
  //       // Pre-paid: due date is on paymentDueDay of the start month
  //       dueDate.setDate(selectedContract.paymentDueDay);
  //       // Ensure it's not before start date
  //       if (dueDate < startDate) {
  //         dueDate.setMonth(dueDate.getMonth() + 1);
  //       }
  //     } else {
  //       // Post-paid: due date is on paymentDueDay of the month after billing period ends
  //       dueDate.setMonth(dueDate.getMonth() + 1);
  //       dueDate.setDate(selectedContract.paymentDueDay);
  //     }

  //     const dueDateStr = dueDate.toISOString().split("T")[0];
  //     setValue("dueDate", dueDateStr);
  //   } catch (error) {
  //     console.error("Error calculating billing period:", error);
  //   }
  // };

  // const updateUtilityReading = (
  //   serviceId: string,
  //   field: keyof UtilityReadingForm,
  //   value: string | number
  // ) => {
  //   setUtilityReadings((prev) =>
  //     prev.map((r) => {
  //       if (r.serviceId === serviceId) {
  //         const updated = { ...r, [field]: value };
  //         if (field === "readingValue") {
  //           const currentValue = parseFloat(value.toString()) || 0;
  //           const previousValue = parseFloat(
  //             updated.previousReadingValue || "0"
  //           );
  //           const usage = currentValue - previousValue;
  //           updated.usageAmount = usage > 0 ? usage : 0;
  //         }
  //         return updated;
  //       }
  //       return r;
  //     })
  //   );
  // };

  // const calculateInvoiceItems = (): InvoiceItem[] => {
  //   return [];
  //   if (!selectedContract) return [];

  //   const items: InvoiceItem[] = [];

  //   // Add rent item
  //   // items.push({
  //   //   type: InvoiceItemType.ROOM_RENT.toString(),
  //   //   amount: selectedContract.rentAmountAgreed,
  //   //   contractServiceId: selectedContract.contractServices[0].id,
  //   //   propertyId: selectedContract.propertyId,
  //   // });

  //   // Add service items
  //   selectedContract.contractServices.forEach((service) => {
  //     if (!service.isEnabled) return;

  //     if (
  //       service.calculationMethod === ServiceCalculateMethod.FIXED_PER_ROOM ||
  //       service.calculationMethod === ServiceCalculateMethod.FIXED_PER_PERSON ||
  //       service.calculationMethod === ServiceCalculateMethod.FIXED_PER_NUMBER
  //     ) {
  //       // Fixed services
  //       items.push({
  //         contractServiceId: service.serviceId || service.id,
  //         serviceName: service.name,
  //         itemType: InvoiceItemType.SERVICE_FIXED,
  //         quantity: 1,
  //         unitPrice: service.price,
  //         totalPrice: service.price,
  //       });
  //     } else if (
  //       service.calculationMethod === ServiceCalculateMethod.PER_UNIT_SIMPLE
  //     ) {
  //       // Per unit services - need utility reading
  //       const reading = utilityReadings.find(
  //         (r) => r.serviceId === (service.serviceId || service.id)
  //       );
  //       if (reading && reading.usageAmount && reading.usageAmount > 0) {
  //         items.push({
  //           serviceId: service.serviceId || service.id,
  //           serviceName: reading.serviceName,
  //           itemType: InvoiceItemType.SERVICE_PER_UNIT,
  //           quantity: reading.usageAmount,
  //           unit: "số",
  //           unitPrice: service.price,
  //           totalPrice: reading.usageAmount * service.price,
  //           readingId: reading.serviceId, // This will be set after creating reading
  //         });
  //       }
  //     }
  //   });

  //   return items;
  // };

  // const handleSave = async (
  //   formData: InvoiceCreateRequest & { isPrepaid: boolean }
  // ) => {
  //   if (!selectedContract) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Lỗi",
  //       text2: "Vui lòng chọn hợp đồng",
  //     });
  //     return;
  //   }

  //   // Validate billing period dates
  //   if (!formData.billingPeriodStart || !formData.billingPeriodEnd) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Lỗi",
  //       text2: "Vui lòng chọn đầy đủ kỳ thanh toán",
  //     });
  //     return;
  //   }

  //   // Validate utility readings for per-unit services
  //   const perUnitServices = selectedContract.contractServices.filter(
  //     (s) =>
  //       s.isEnabled &&
  //       s.calculationMethod === ServiceCalculateMethod.PER_UNIT_SIMPLE
  //   );
  //   if (perUnitServices.length > 0) {
  //     const invalidReadings = utilityReadings.filter(
  //       (r) =>
  //         !r.readingValue ||
  //         isNaN(parseFloat(r.readingValue)) ||
  //         parseFloat(r.readingValue) < 0
  //     );
  //     if (invalidReadings.length > 0) {
  //       const serviceNames = invalidReadings
  //         .map((r) => r.serviceName)
  //         .join(", ");
  //       Toast.show({
  //         type: "error",
  //         text1: "Lỗi",
  //         text2: `Vui lòng nhập đầy đủ chỉ số cho: ${serviceNames}`,
  //       });
  //       return;
  //     }

  //     // Validate reading values are greater than previous
  //     const invalidValues = utilityReadings.filter((r) => {
  //       if (!r.readingValue || !r.previousReadingValue) return false;
  //       return parseFloat(r.readingValue) < parseFloat(r.previousReadingValue);
  //     });
  //     if (invalidValues.length > 0) {
  //       Toast.show({
  //         type: "error",
  //         text1: "Lỗi",
  //         text2: "Chỉ số hiện tại phải lớn hơn hoặc bằng chỉ số kỳ trước",
  //       });
  //       return;
  //     }
  //   }

  //   try {
  //     setIsSubmitting(true);

  //     // Create utility readings first
  //     const readingIds: Record<string, string> = {};
  //     for (const reading of utilityReadings) {
  //       if (reading.readingValue) {
  //         const readingData: UtilityReadingCreateRequest = {
  //           roomId: selectedContract.roomId,
  //           serviceId: reading.serviceId,
  //           readingDate: formData.billingPeriodEnd,
  //           readingValue: parseFloat(reading.readingValue),
  //           previousReadingValue: reading.previousReadingValue
  //             ? parseFloat(reading.previousReadingValue)
  //             : undefined,
  //           usageAmount: reading.usageAmount,
  //         };

  //         const response = await createUtilityReading(readingData);
  //         if (response.success && response.data) {
  //           readingIds[reading.serviceId] = response.data.id;
  //         }
  //       }
  //     }

  //     // Calculate invoice items
  //     const invoiceItems = calculateInvoiceItems().map((item) => {
  //       if (item.readingId && readingIds[item.readingId]) {
  //         item.readingId = readingIds[item.readingId];
  //       }
  //       return item;
  //     });

  //     // Create invoice
  //     const invoiceData: InvoiceCreateRequest = {
  //       contractId: formData.contractId,
  //       billingPeriodStart: formData.billingPeriodStart,
  //       billingPeriodEnd: formData.billingPeriodEnd,
  //       dueDate: formData.dueDate,
  //       invoiceItems,
  //       notes: formData.notes,
  //     };

  //     const response = await createInvoice(invoiceData);
  //     if (response.success && response.data) {
  //       Toast.show({
  //         type: "success",
  //         text1: "Thành công",
  //         text2: "Đã tạo hóa đơn thành công",
  //       });
  //       navigation.goBack();
  //     } else {
  //       throw new Error(response.message || "Không thể tạo hóa đơn");
  //     }
  //   } catch (error: any) {
  //     console.error("Error creating invoice:", error);
  //     Toast.show({
  //       type: "error",
  //       text1: "Lỗi",
  //       text2: error.message || "Không thể tạo hóa đơn",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // // Memoized calculations for better performance - MUST be called before any early returns
  // const invoiceItems = useMemo(() => {
  //   return calculateInvoiceItems();
  // }, [selectedContract, utilityReadings]);

  // const totalAmount = useMemo(() => {
  //   return invoiceItems.reduce((sum, item) => sum + item.totalPrice, 0);
  // }, [invoiceItems]);

  // const rentAmount = useMemo(() => {
  //   return (
  //     invoiceItems.find((item) => item.itemType === InvoiceItemType.RENT)
  //       ?.totalPrice || 0
  //   );
  // }, [invoiceItems]);

  // const serviceAmount = useMemo(() => {
  //   return invoiceItems
  //     .filter((item) => item.itemType !== InvoiceItemType.RENT)
  //     .reduce((sum, item) => sum + item.totalPrice, 0);
  // }, [invoiceItems]);

  // if (contracts.length === 0 && !isLoading) {
  //   return (
  //     <View className="flex-1 items-center justify-center p-4 bg-gray-50">
  //       <View className="items-center">
  //         <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
  //           <Ionicons name="document-outline" size={40} color="#9CA3AF" />
  //         </View>
  //         <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
  //           Không có hợp đồng nào
  //         </Text>
  //         <Text className="text-sm text-gray-500 text-center px-8">
  //           Vui lòng tạo hợp đồng trước khi tạo hóa đơn
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }

  // return (
  //   <>
  //     <KeyboardAwareScrollView
  //       contentContainerStyle={{
  //         padding: 16,
  //         display: "flex",
  //         flexDirection: "column",
  //         gap: 16,
  //       }}
  //       enableOnAndroid={true}
  //       extraScrollHeight={30}
  //       keyboardOpeningTime={0}
  //       enableAutomaticScroll={true}
  //       enableResetScrollToCoords={false}
  //       keyboardShouldPersistTaps="handled"
  //       showsVerticalScrollIndicator={false}
  //     >
  //       <CardComponent title="Chọn hợp đồng">
  //         <Controller
  //           control={control}
  //           name="contractId"
  //           rules={{ required: "Vui lòng chọn hợp đồng" }}
  //           render={({ field: { onChange, value }, fieldState: { error } }) => (
  //             <ComboBox
  //               value={value}
  //               options={contracts.map((c) => ({
  //                 key: c.id,
  //                 label: `${c.code} - ${c.room.name}`,
  //               }))}
  //               onChange={(option) => {
  //                 onChange(option.key);
  //               }}
  //               placeholder="Chọn hợp đồng"
  //               label="Hợp đồng"
  //               required
  //               error={error?.message}
  //               labelKey="label"
  //               valueKey="key"
  //               icon="document-text-outline"
  //             />
  //           )}
  //         />
  //       </CardComponent>

  //       {selectedContract && (
  //         <>
  //           <CardComponent title="Thông tin hợp đồng">
  //             <View className="flex-row justify-between items-start mb-3">
  //               <View className="flex-1">
  //                 <Text className="text-base font-semibold text-gray-900 mb-1">
  //                   {selectedContract.room.name}
  //                 </Text>
  //                 <Text className="text-sm text-gray-600">
  //                   {selectedContract.property.name}
  //                 </Text>
  //               </View>
  //               <View className="items-end">
  //                 <Text className="text-xs text-gray-500 mb-1">Tiền thuê</Text>
  //                 <Text className="text-lg font-bold text-blue-600">
  //                   {formatCurrency(
  //                     selectedContract.rentAmountAgreed.toString()
  //                   )}
  //                   đ/tháng
  //                 </Text>
  //               </View>
  //             </View>
  //           </CardComponent>

  //           <CardComponent title="Loại thanh toán">
  //             <Controller
  //               control={control}
  //               name="isPrepaid"
  //               render={({ field: { onChange, value } }) => (
  //                 <Switch
  //                   label="Thanh toán trước (Pre-paid)"
  //                   value={value}
  //                   onValueChange={onChange}
  //                 />
  //               )}
  //             />
  //           </CardComponent>

  //           <CardComponent title="Kỳ thanh toán">
  //             <View className="mb-3">
  //               <Controller
  //                 control={control}
  //                 name="billingPeriodStart"
  //                 rules={{
  //                   required: "Vui lòng chọn ngày bắt đầu kỳ thanh toán",
  //                 }}
  //                 render={({
  //                   field: { onChange, value },
  //                   fieldState: { error },
  //                 }) => (
  //                   <DatePicker
  //                     label="Ngày bắt đầu kỳ thanh toán"
  //                     value={value}
  //                     onChange={(date) => {
  //                       onChange(date?.toISOString().split("T")[0] || "");
  //                     }}
  //                     placeholder="Chọn ngày bắt đầu"
  //                     required
  //                     error={error?.message}
  //                     icon="calendar"
  //                   />
  //                 )}
  //               />
  //             </View>

  //             <View className="mb-3">
  //               <Text className="text-sm text-gray-600 mb-1">
  //                 Ngày kết thúc kỳ thanh toán
  //               </Text>
  //               <Controller
  //                 control={control}
  //                 name="billingPeriodEnd"
  //                 render={({ field: { value } }) => (
  //                   <Text className="text-base font-semibold text-gray-900">
  //                     {value ? formatDate(value) : "Tự động tính"}
  //                   </Text>
  //                 )}
  //               />
  //             </View>

  //             <View>
  //               <Text className="text-sm text-gray-600 mb-1">
  //                 Hạn thanh toán
  //               </Text>
  //               <Controller
  //                 control={control}
  //                 name="dueDate"
  //                 render={({ field: { value } }) => (
  //                   <Text className="text-base font-semibold text-gray-900">
  //                     {value ? formatDate(value) : "Tự động tính"}
  //                   </Text>
  //                 )}
  //               />
  //             </View>
  //           </CardComponent>

  //           {utilityReadings.length > 0 && (
  //             <CardComponent title="Chỉ số điện nước">
  //               {utilityReadings.map((reading, index) => (
  //                 <View
  //                   key={reading.serviceId}
  //                   className={
  //                     index !== utilityReadings.length - 1 ? "mb-4" : ""
  //                   }
  //                 >
  //                   <Text className="text-sm font-semibold text-gray-700 mb-2">
  //                     {reading.serviceName}
  //                   </Text>
  //                   {reading.previousReadingValue && (
  //                     <View className="mb-2">
  //                       <Text className="text-xs text-gray-500 mb-1">
  //                         Chỉ số kỳ trước
  //                       </Text>
  //                       <Text className="text-sm font-medium text-gray-900">
  //                         {parseFloat(
  //                           reading.previousReadingValue
  //                         ).toLocaleString()}
  //                       </Text>
  //                     </View>
  //                   )}
  //                   <Input
  //                     label="Chỉ số hiện tại"
  //                     value={reading.readingValue}
  //                     onChangeText={(text) =>
  //                       updateUtilityReading(
  //                         reading.serviceId,
  //                         "readingValue",
  //                         text
  //                       )
  //                     }
  //                     placeholder="Nhập chỉ số"
  //                     type="number"
  //                     keyboardType="numeric"
  //                     icon="calculator-outline"
  //                     required
  //                   />
  //                   {reading.usageAmount !== undefined &&
  //                     reading.usageAmount > 0 && (
  //                       <View className="mt-2">
  //                         <Text className="text-xs text-gray-500">
  //                           Số sử dụng
  //                         </Text>
  //                         <Text className="text-sm font-semibold text-green-600">
  //                           {reading.usageAmount.toFixed(2)}
  //                         </Text>
  //                       </View>
  //                     )}
  //                 </View>
  //               ))}
  //             </CardComponent>
  //           )}

  //           <CardComponent title="Tóm tắt hóa đơn">
  //             {invoiceItems.length === 0 ? (
  //               <View className="py-6 items-center">
  //                 <Ionicons name="receipt-outline" size={32} color="#9CA3AF" />
  //                 <Text className="text-sm text-gray-500 mt-3 text-center">
  //                   Chưa có khoản phí nào
  //                 </Text>
  //               </View>
  //             ) : (
  //               <View>
  //                 {invoiceItems.map((item, index) => (
  //                   <View
  //                     key={`item-${index}`}
  //                     className="flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0"
  //                   >
  //                     <View className="flex-1">
  //                       <Text className="text-sm font-medium text-gray-900">
  //                         {item.serviceName}
  //                       </Text>
  //                       {item.quantity && item.unit && (
  //                         <Text className="text-xs text-gray-500 mt-0.5">
  //                           {item.quantity.toFixed(2)} {item.unit} ×{" "}
  //                           {formatCurrency(item.unitPrice.toString())}đ
  //                         </Text>
  //                       )}
  //                     </View>
  //                     <Text className="text-sm font-semibold text-gray-900">
  //                       {formatCurrency(item.totalPrice.toString())}đ
  //                     </Text>
  //                   </View>
  //                 ))}
  //                 <View className="border-t border-gray-200 pt-3 mt-2">
  //                   <View className="flex-row items-center justify-between mb-2">
  //                     <Text className="text-sm text-gray-600">Tiền thuê</Text>
  //                     <Text className="text-sm font-semibold text-gray-900">
  //                       {formatCurrency(rentAmount.toString())}đ
  //                     </Text>
  //                   </View>
  //                   <View className="flex-row items-center justify-between mb-2">
  //                     <Text className="text-sm text-gray-600">Dịch vụ</Text>
  //                     <Text className="text-sm font-semibold text-gray-900">
  //                       {formatCurrency(serviceAmount.toString())}đ
  //                     </Text>
  //                   </View>
  //                   <View className="flex-row items-center justify-between pt-2 border-t border-gray-200">
  //                     <Text className="text-base font-bold text-gray-900">
  //                       Tổng cộng
  //                     </Text>
  //                     <Text className="text-lg font-bold text-blue-600">
  //                       {formatCurrency(totalAmount.toString())}đ
  //                     </Text>
  //                   </View>
  //                 </View>
  //               </View>
  //             )}
  //           </CardComponent>

  //           <CardComponent title="Ghi chú (tùy chọn)">
  //             <Controller
  //               control={control}
  //               name="notes"
  //               render={({ field: { onChange, value } }) => (
  //                 <Input
  //                   type="area"
  //                   value={value}
  //                   onChangeText={onChange}
  //                   placeholder="Nhập ghi chú"
  //                   multiline
  //                   numberOfLines={3}
  //                   textAlignVertical="top"
  //                 />
  //               )}
  //             />
  //           </CardComponent>
  //         </>
  //       )}
  //     </KeyboardAwareScrollView>
  //     <ActionButtonBottom
  //       actions={[
  //         {
  //           label: "Tạo hóa đơn",
  //           icon: "checkmark-circle",
  //           isLoading: isSubmitting,
  //           onPress: handleSubmit(handleSave, (errors) => {
  //             Toast.show({
  //               type: "error",
  //               text1: "Lỗi",
  //               text2: "Vui lòng nhập đầy đủ thông tin!",
  //             });
  //           }),
  //         },
  //       ]}
  //     />
  //   </>
  // );
};

export default CreateInvoiceScreen;
