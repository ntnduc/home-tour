import React from "react";
import { Text, View } from "react-native";

const InvoiceDetailScreen = () => {
  return (
    <View>
      <Text>123</Text>
    </View>
  );
};

export default InvoiceDetailScreen;

// import {
//   createPayment,
//   getInvoice,
//   getPaymentsByInvoice,
// } from "@/api/invoice/invoice.api";
// import ActionButtonBottom from "@/components/ActionButtonBottom";
// import { ComboBox } from "@/components/ComboBox";
// import DatePicker from "@/components/Da  tePicker";
// import { useGlobalAppSheet } from "@/components/GlobalAppSheet";
// import Input from "@/components/Input";
// import Loading from "@/components/Loading";
// import { RootStackParamList } from "@/navigation/types";
// import CardComponent from "@/screens/common/CardComponent";
// import {
//   INVOICE_STATUS_COLOR,
//   INVOICE_STATUS_LABEL,
//   InvoiceDetailResponse,
//   InvoiceItem,
//   InvoiceStatus,
//   PaymentCreateRequest,
//   PaymentFor,
//   PaymentMethod,
// } from "@/types/payment";
// import { formatCurrency, getStoreUser } from "@/utils/appUtil";
// import { formatDate } from "@/utils/dateUtil";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { BottomSheetView } from "@gorhom/bottom-sheet";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import React, { useEffect, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Text, TouchableOpacity, View } from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import Toast from "react-native-toast-message";

// type InvoiceDetailScreenProps = {
//   navigation: NativeStackNavigationProp<RootStackParamList, "InvoiceDetail">;
//   route: { params: RootStackParamList["InvoiceDetail"] };
// };

// const InvoiceDetailScreen = ({
//   navigation,
//   route,
// }: InvoiceDetailScreenProps) => {
//   const { invoiceId } = route.params;
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [invoice, setInvoice] = useState<InvoiceDetailResponse | null>(null);
//   const [payments, setPayments] = useState<any[]>([]);
//   const { openAppSheet, closeAppSheet } = useGlobalAppSheet();

//   interface PaymentFormData {
//     invoiceId?: string;
//     roomId: string;
//     amount: number;
//     paymentDate: Date | null;
//     paymentMethod: PaymentMethod;
//     paymentFor: PaymentFor;
//     note?: string;
//   }

//   const { control, handleSubmit, setValue, watch, reset } =
//     useForm<PaymentFormData>({
//       defaultValues: {
//         invoiceId: invoiceId,
//         roomId: "",
//         amount: 0,
//         paymentDate: new Date(),
//         paymentMethod: PaymentMethod.CASH,
//         paymentFor: PaymentFor.INVOICE,
//         note: "",
//       },
//     });

//   const paymentAmount = watch("amount");
//   const balanceRemaining = invoice ? invoice.balanceRemaining : 0;

//   useEffect(() => {
//     fetchInvoice();
//     fetchPayments();
//   }, [invoiceId]);

//   const fetchInvoice = async () => {
//     try {
//       setIsLoading(true);
//       const response = await getInvoice(invoiceId);
//       if (response.success && response.data) {
//         setInvoice(response.data);
//         setValue("roomId", response.data.roomId);
//         setValue("amount", response.data.balanceRemaining);
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Lỗi",
//           text2: "Không thể tải thông tin hóa đơn",
//         });
//         navigation.goBack();
//       }
//     } catch (error) {
//       console.error("Error fetching invoice:", error);
//       Toast.show({
//         type: "error",
//         text1: "Lỗi",
//         text2: "Không thể tải thông tin hóa đơn",
//       });
//       navigation.goBack();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchPayments = async () => {
//     try {
//       const response = await getPaymentsByInvoice(invoiceId);
//       if (response.success && response.data) {
//         setPayments(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//     }
//   };

//   const handleOpenPaymentForm = () => {
//     if (invoice) {
//       setValue("amount", invoice.balanceRemaining);
//       setValue("paymentDate", new Date());

//       openAppSheet(
//         <BottomSheetView>
//           <KeyboardAwareScrollView
//             contentContainerStyle={{ padding: 16, gap: 16 }}
//             keyboardShouldPersistTaps="handled"
//           >
//             <View>
//               <Text className="text-sm text-gray-500 mb-1">
//                 Số tiền còn lại
//               </Text>
//               <Text className="text-2xl font-bold text-blue-600">
//                 {formatCurrency(balanceRemaining.toString())}đ
//               </Text>
//             </View>

//             <Controller
//               control={control}
//               name="amount"
//               rules={{
//                 required: "Vui lòng nhập số tiền",
//                 min: { value: 1, message: "Số tiền phải lớn hơn 0" },
//                 max: {
//                   value: balanceRemaining,
//                   message: "Số tiền không được vượt quá số tiền còn lại",
//                 },
//               }}
//               render={({
//                 field: { onChange, value },
//                 fieldState: { error },
//               }) => (
//                 <Input
//                   label="Số tiền thanh toán"
//                   value={value ? formatCurrency(value.toString()) : ""}
//                   onChangeText={(text) => {
//                     const numValue = parseFloat(
//                       text.replace(/[.,]/g, "") || "0"
//                     );
//                     onChange(numValue);
//                   }}
//                   placeholder="Nhập số tiền"
//                   type="number"
//                   keyboardType="numeric"
//                   icon="cash"
//                   required
//                   error={error?.message}
//                 />
//               )}
//             />

//             <Controller
//               control={control}
//               name="paymentDate"
//               rules={{ required: "Vui lòng chọn ngày thanh toán" }}
//               render={({
//                 field: { onChange, value },
//                 fieldState: { error },
//               }) => (
//                 <DatePicker
//                   label="Ngày thanh toán"
//                   value={value}
//                   onChange={onChange}
//                   placeholder="Chọn ngày thanh toán"
//                   required
//                   error={error?.message}
//                   icon="calendar"
//                   maxDate={new Date()}
//                 />
//               )}
//             />

//             <Controller
//               control={control}
//               name="paymentMethod"
//               rules={{ required: "Vui lòng chọn phương thức thanh toán" }}
//               render={({
//                 field: { onChange, value },
//                 fieldState: { error },
//               }) => (
//                 <ComboBox
//                   value={value}
//                   options={Object.values(PaymentMethod).map((method) => ({
//                     key: method,
//                     label:
//                       method === PaymentMethod.CASH
//                         ? "Tiền mặt"
//                         : method === PaymentMethod.BANK_TRANSFER
//                           ? "Chuyển khoản"
//                           : method === PaymentMethod.MOBILE_BANKING
//                             ? "Mobile Banking"
//                             : method === PaymentMethod.CREDIT_CARD
//                               ? "Thẻ tín dụng"
//                               : "Khác",
//                   }))}
//                   onChange={(option) => onChange(option.key)}
//                   placeholder="Chọn phương thức thanh toán"
//                   label="Phương thức thanh toán"
//                   required
//                   error={error?.message}
//                   labelKey="label"
//                   valueKey="key"
//                   icon="card-outline"
//                 />
//               )}
//             />

//             <Controller
//               control={control}
//               name="note"
//               render={({ field: { onChange, value } }) => (
//                 <Input
//                   type="area"
//                   label="Ghi chú (tùy chọn)"
//                   value={value}
//                   onChangeText={onChange}
//                   placeholder="Nhập ghi chú"
//                   multiline
//                   numberOfLines={3}
//                   textAlignVertical="top"
//                 />
//               )}
//             />

//             <View className="flex-row gap-3 mt-4">
//               <TouchableOpacity
//                 className="flex-1 bg-gray-200 py-4 rounded-xl items-center"
//                 onPress={() => {
//                   closeAppSheet();
//                   reset();
//                 }}
//               >
//                 <Text className="text-base font-semibold text-gray-700">
//                   Hủy
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="flex-1 bg-blue-600 py-4 rounded-xl items-center"
//                 onPress={handleSubmit(handleSavePayment)}
//                 disabled={isSubmitting}
//               >
//                 <Text className="text-base font-semibold text-white">
//                   {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAwareScrollView>
//         </BottomSheetView>,
//         {
//           snapPoints: ["80%"],
//           header: {
//             title: "Ghi nhận thanh toán",
//             onClose: () => {
//               closeAppSheet();
//               reset();
//             },
//           },
//         }
//       );
//     }
//   };

//   const handleSavePayment = async (formData: PaymentFormData) => {
//     if (!invoice) return;

//     if (!formData.paymentDate) {
//       Toast.show({
//         type: "error",
//         text1: "Lỗi",
//         text2: "Vui lòng chọn ngày thanh toán",
//       });
//       return;
//     }

//     if (formData.amount <= 0) {
//       Toast.show({
//         type: "error",
//         text1: "Lỗi",
//         text2: "Số tiền thanh toán phải lớn hơn 0",
//       });
//       return;
//     }

//     if (formData.amount > invoice.balanceRemaining) {
//       Toast.show({
//         type: "error",
//         text1: "Lỗi",
//         text2: "Số tiền thanh toán không được vượt quá số tiền còn lại",
//       });
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const user = await getStoreUser();
//       const paymentData: PaymentCreateRequest = {
//         invoiceId: invoice.id,
//         contractId: invoice.contractId,
//         roomId: invoice.roomId,
//         amount: formData.amount,
//         paymentDate: formData.paymentDate.toISOString().split("T")[0],
//         paymentMethod: formData.paymentMethod,
//         paymentFor: PaymentFor.INVOICE,
//         note: formData.note,
//       };

//       const response = await createPayment(paymentData);
//       if (response.success && response.data) {
//         Toast.show({
//           type: "success",
//           text1: "Thành công",
//           text2: "Đã ghi nhận thanh toán thành công",
//         });
//         reset();
//         fetchInvoice();
//         fetchPayments();
//       } else {
//         throw new Error(response.message || "Không thể ghi nhận thanh toán");
//       }
//     } catch (error: any) {
//       console.error("Error creating payment:", error);
//       Toast.show({
//         type: "error",
//         text1: "Lỗi",
//         text2: error.message || "Không thể ghi nhận thanh toán",
//       });
//     } finally {
//       setIsSubmitting(false);
//       closeAppSheet();
//     }
//   };

//   const getDaysOverdue = (dueDate: string) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffTime = today.getTime() - due.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays > 0 ? diffDays : 0;
//   };

//   const formatDateString = (dateString: string) => {
//     return formatDate(dateString);
//   };

//   const getInvoiceItemIcon = (item: InvoiceItem) => {
//     if (item.itemType === "RENT") return "home";
//     if (item.serviceName?.toLowerCase().includes("điện")) return "flash";
//     if (item.serviceName?.toLowerCase().includes("nước")) return "water";
//     if (item.serviceName?.toLowerCase().includes("wifi")) return "wifi";
//     return "construct";
//   };

//   if (isLoading || !invoice) {
//     return <Loading />;
//   }

//   const statusColor = INVOICE_STATUS_COLOR[invoice.status];
//   const daysOverdue = getDaysOverdue(invoice.dueDate);
//   const canMakePayment =
//     invoice.status === InvoiceStatus.SENT ||
//     invoice.status === InvoiceStatus.PARTIALLY_PAID ||
//     invoice.status === InvoiceStatus.OVERDUE;

//   return (
//     <>
//       <KeyboardAwareScrollView
//         contentContainerStyle={{
//           padding: 16,
//           display: "flex",
//           flexDirection: "column",
//           gap: 16,
//         }}
//         enableOnAndroid={true}
//         extraScrollHeight={30}
//         keyboardOpeningTime={0}
//         enableAutomaticScroll={true}
//         enableResetScrollToCoords={false}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header Card */}
//         <CardComponent>
//           <View className="flex-row justify-between items-start mb-4">
//             <View className="flex-1">
//               <Text className="text-xl font-bold text-gray-900 mb-1">
//                 {invoice.contract?.room?.name || invoice.roomName || "N/A"}
//               </Text>
//               <Text className="text-sm text-gray-600 mb-1">
//                 {invoice.contract?.room?.property?.name || "N/A"}
//               </Text>
//               <Text className="text-sm text-gray-500">
//                 {invoice.contract?.primaryPropertyUser?.fullName ||
//                   invoice.tenantName ||
//                   "N/A"}
//               </Text>
//             </View>
//             <View
//               className="px-3 py-1.5 rounded-full flex-row items-center"
//               style={{ backgroundColor: statusColor.bg }}
//             >
//               <Ionicons
//                 name={
//                   invoice.status === InvoiceStatus.PAID
//                     ? "checkmark-circle"
//                     : invoice.status === InvoiceStatus.OVERDUE
//                       ? "warning"
//                       : "time"
//                 }
//                 size={14}
//                 color={statusColor.color}
//               />
//               <Text
//                 className="text-xs font-semibold ml-1"
//                 style={{ color: statusColor.color }}
//               >
//                 {INVOICE_STATUS_LABEL[invoice.status]}
//               </Text>
//             </View>
//           </View>

//           {invoice.status === InvoiceStatus.OVERDUE && (
//             <View className="bg-red-50 rounded-lg p-3 border border-red-200 mb-4 flex-row items-center">
//               <Ionicons name="warning" size={20} color="#FF3B30" />
//               <View className="ml-3 flex-1">
//                 <Text className="text-sm font-semibold text-red-800">
//                   Hóa đơn quá hạn
//                 </Text>
//                 <Text className="text-xs text-red-600">
//                   Quá hạn {daysOverdue} ngày
//                 </Text>
//               </View>
//             </View>
//           )}

//           <View className="items-center pt-4 border-t border-gray-200">
//             <Text className="text-sm text-gray-500 mb-2">Tổng cộng</Text>
//             <Text className="text-3xl font-bold text-blue-600">
//               {formatCurrency(invoice.totalAmountDue.toString())}đ
//             </Text>
//             {invoice.balanceRemaining > 0 && (
//               <View className="mt-2 flex-row items-center">
//                 <Text className="text-sm text-gray-500 mr-2">Còn lại: </Text>
//                 <Text className="text-base font-semibold text-red-600">
//                   {formatCurrency(invoice.balanceRemaining.toString())}đ
//                 </Text>
//               </View>
//             )}
//           </View>
//         </CardComponent>

//         {/* Invoice Items */}
//         <CardComponent title="Chi tiết hóa đơn">
//           <View className="space-y-3">
//             {invoice.invoiceItems.map((item, index) => (
//               <View
//                 key={item.id || index}
//                 className="flex-row justify-between items-start py-3 border-b border-gray-100 last:border-0"
//               >
//                 <View className="flex-1 flex-row items-start">
//                   <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
//                     <Ionicons
//                       name={getInvoiceItemIcon(item) as any}
//                       size={16}
//                       color="#007AFF"
//                     />
//                   </View>
//                   <View className="flex-1">
//                     <Text className="text-base font-semibold text-gray-900 mb-1">
//                       {item.serviceName}
//                     </Text>
//                     {item.quantity && item.unit && (
//                       <Text className="text-sm text-gray-500">
//                         {item.quantity} {item.unit} ×{" "}
//                         {formatCurrency(item.unitPrice.toString())}đ
//                       </Text>
//                     )}
//                     {item.notes && (
//                       <Text className="text-xs text-gray-400 mt-1">
//                         {item.notes}
//                       </Text>
//                     )}
//                   </View>
//                 </View>
//                 <Text className="text-base font-semibold text-gray-900">
//                   {formatCurrency(item.totalPrice.toString())}đ
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </CardComponent>

//         {/* Payment History */}
//         {payments.length > 0 && (
//           <CardComponent title="Lịch sử thanh toán">
//             <View className="space-y-3">
//               {payments.map((payment, index) => (
//                 <View
//                   key={payment.id || index}
//                   className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-0"
//                 >
//                   <View className="flex-1">
//                     <Text className="text-sm font-medium text-gray-900">
//                       {formatDateString(payment.paymentDate)}
//                     </Text>
//                     <Text className="text-xs text-gray-500">
//                       {payment.paymentMethod || "Tiền mặt"}
//                     </Text>
//                   </View>
//                   <Text className="text-base font-semibold text-green-600">
//                     {formatCurrency(payment.amount.toString())}đ
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           </CardComponent>
//         )}

//         {/* Invoice Info */}
//         <CardComponent title="Thông tin hóa đơn">
//           <View className="space-y-3">
//             <View className="flex-row justify-between items-center">
//               <Text className="text-sm text-gray-500">Kỳ thanh toán</Text>
//               <Text className="text-sm font-medium text-gray-900">
//                 {formatDateString(invoice.billingPeriodStart)} -{" "}
//                 {formatDateString(invoice.billingPeriodEnd)}
//               </Text>
//             </View>
//             <View className="flex-row justify-between items-center">
//               <Text className="text-sm text-gray-500">Hạn thanh toán</Text>
//               <Text className="text-sm font-medium text-gray-900">
//                 {formatDateString(invoice.dueDate)}
//               </Text>
//             </View>
//             <View className="flex-row justify-between items-center">
//               <Text className="text-sm text-gray-500">Ngày tạo</Text>
//               <Text className="text-sm font-medium text-gray-900">
//                 {formatDateString(invoice.createdAt)}
//               </Text>
//             </View>
//             {invoice.notes && (
//               <View className="mt-2">
//                 <Text className="text-sm text-gray-500 mb-1">Ghi chú</Text>
//                 <Text className="text-sm text-gray-900">{invoice.notes}</Text>
//               </View>
//             )}
//           </View>
//         </CardComponent>
//       </KeyboardAwareScrollView>

//       {canMakePayment && (
//         <ActionButtonBottom
//           actions={[
//             {
//               label: "Ghi nhận thanh toán",
//               icon: "cash",
//               onPress: handleOpenPaymentForm,
//             },
//           ]}
//         />
//       )}
//     </>
//   );
// };

// export default InvoiceDetailScreen;
