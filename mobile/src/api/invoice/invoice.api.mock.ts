// import { ApiResponse } from "@/types/api";
// import { BasePagingRequest } from "@/types/base.request";
// import { BasePagingResponse } from "@/types/base.response";
// import {
//   InvoiceCreateRequest,
//   InvoiceDetailResponse,
//   InvoiceListResponse,
//   PaymentCreateRequest,
//   PaymentResponse,
//   UtilityReadingCreateRequest,
//   UtilityReadingResponse,
//   InvoiceStatus,
//   PaymentMethod,
//   InvoiceItemType,
//   PaymentFor,
// } from "@/types/payment";
// import { generateId } from "@/utils/appUtil";

// // ========== MOCK DATA ==========
// const mockInvoices: InvoiceDetailResponse[] = [
//   {
//     id: "inv-1",
//     contractId: "contract-1",
//     roomId: "room-1",
//     roomName: "Phòng 101",
//     tenantName: "Nguyễn Văn A",
//     billingPeriodStart: "2024-01-01",
//     billingPeriodEnd: "2024-01-31",
//     dueDate: "2024-02-05",
//     totalAmountDue: 4200000,
//     rentAmount: 3500000,
//     serviceAmount: 700000,
//     amountPaid: 0,
//     balanceRemaining: 4200000,
//     status: InvoiceStatus.SENT,
//     invoiceItems: [
//       {
//         id: "item-1",
//         invoiceId: "inv-1",
//         serviceName: "Tiền thuê phòng",
//         itemType: InvoiceItemType.RENT,
//         quantity: 1,
//         unitPrice: 3500000,
//         totalPrice: 3500000,
//       },
//       {
//         id: "item-2",
//         invoiceId: "inv-1",
//         serviceId: "service-1",
//         serviceName: "Điện",
//         itemType: InvoiceItemType.SERVICE_PER_UNIT,
//         quantity: 100,
//         unit: "số",
//         unitPrice: 3500,
//         totalPrice: 350000,
//       },
//       {
//         id: "item-3",
//         invoiceId: "inv-1",
//         serviceId: "service-2",
//         serviceName: "Nước",
//         itemType: InvoiceItemType.SERVICE_PER_UNIT,
//         quantity: 15,
//         unit: "m³",
//         unitPrice: 15000,
//         totalPrice: 225000,
//       },
//       {
//         id: "item-4",
//         invoiceId: "inv-1",
//         serviceId: "service-3",
//         serviceName: "Wifi",
//         itemType: InvoiceItemType.SERVICE_FIXED,
//         quantity: 1,
//         unitPrice: 100000,
//         totalPrice: 100000,
//       },
//     ],
//     contract: {
//       id: "contract-1",
//       code: "HD-2024-001",
//       room: {
//         id: "room-1",
//         name: "Phòng 101",
//         property: {
//           id: "prop-1",
//           name: "Tòa nhà A",
//         },
//       },
//       primaryPropertyUser: {
//         id: "user-1",
//         fullName: "Nguyễn Văn A",
//         phone: "0901234567",
//       },
//     },
//     createdAt: "2024-01-28T10:00:00Z",
//     updatedAt: "2024-01-28T10:00:00Z",
//   },
//   {
//     id: "inv-2",
//     contractId: "contract-2",
//     roomId: "room-2",
//     roomName: "Phòng 102",
//     tenantName: "Trần Thị B",
//     billingPeriodStart: "2024-01-01",
//     billingPeriodEnd: "2024-01-31",
//     dueDate: "2024-02-05",
//     totalAmountDue: 3800000,
//     rentAmount: 3200000,
//     serviceAmount: 600000,
//     amountPaid: 3800000,
//     balanceRemaining: 0,
//     status: InvoiceStatus.PAID,
//     invoiceItems: [
//       {
//         id: "item-5",
//         invoiceId: "inv-2",
//         serviceName: "Tiền thuê phòng",
//         itemType: InvoiceItemType.RENT,
//         quantity: 1,
//         unitPrice: 3200000,
//         totalPrice: 3200000,
//       },
//       {
//         id: "item-6",
//         invoiceId: "inv-2",
//         serviceId: "service-1",
//         serviceName: "Điện",
//         itemType: InvoiceItemType.SERVICE_PER_UNIT,
//         quantity: 80,
//         unit: "số",
//         unitPrice: 3500,
//         totalPrice: 280000,
//       },
//       {
//         id: "item-7",
//         invoiceId: "inv-2",
//         serviceId: "service-2",
//         serviceName: "Nước",
//         itemType: InvoiceItemType.SERVICE_PER_UNIT,
//         quantity: 12,
//         unit: "m³",
//         unitPrice: 15000,
//         totalPrice: 180000,
//       },
//       {
//         id: "item-8",
//         invoiceId: "inv-2",
//         serviceId: "service-3",
//         serviceName: "Wifi",
//         itemType: InvoiceItemType.SERVICE_FIXED,
//         quantity: 1,
//         unitPrice: 100000,
//         totalPrice: 100000,
//       },
//     ],
//     contract: {
//       id: "contract-2",
//       code: "HD-2024-002",
//       room: {
//         id: "room-2",
//         name: "Phòng 102",
//         property: {
//           id: "prop-1",
//           name: "Tòa nhà A",
//         },
//       },
//       primaryPropertyUser: {
//         id: "user-2",
//         fullName: "Trần Thị B",
//         phone: "0901234568",
//       },
//     },
//     createdAt: "2024-01-28T10:00:00Z",
//     updatedAt: "2024-02-03T10:00:00Z",
//   },
// ];

// const mockPayments: Record<string, PaymentResponse[]> = {
//   "inv-1": [],
//   "inv-2": [
//     {
//       id: "pay-1",
//       invoiceId: "inv-2",
//       contractId: "contract-2",
//       roomId: "room-2",
//       amount: 3800000,
//       paymentDate: "2024-02-03",
//       paymentMethod: PaymentMethod.BANK_TRANSFER,
//       paymentFor: PaymentFor.INVOICE,
//       createdAt: "2024-02-03T10:00:00Z",
//     },
//   ],
// };

// const mockUtilityReadings: UtilityReadingResponse[] = [];

// // ========== MOCK API FUNCTIONS ==========

// // Invoice APIs
// export const getListInvoiceMock = async (
//   queryKey: BasePagingRequest
// ): Promise<ApiResponse<BasePagingResponse<InvoiceListResponse>>> => {
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   const invoices: InvoiceListResponse[] = mockInvoices.map((inv) => ({
//     id: inv.id,
//     contractId: inv.contractId,
//     roomId: inv.roomId,
//     roomName: inv.roomName || "",
//     tenantName: inv.tenantName || "",
//     billingPeriodStart: inv.billingPeriodStart,
//     billingPeriodEnd: inv.billingPeriodEnd,
//     dueDate: inv.dueDate,
//     totalAmountDue: inv.totalAmountDue,
//     amountPaid: inv.amountPaid,
//     balanceRemaining: inv.balanceRemaining,
//     status: inv.status,
//     createdAt: inv.createdAt,
//   }));

//   return {
//     success: true,
//     data: {
//       items: invoices,
//       total: invoices.length,
//       limit: queryKey.limit || 10,
//       offset: queryKey.offset || 0,
//     },
//     message: "Success",
//   };
// };

// export const getInvoiceMock = async (
//   id: string
// ): Promise<ApiResponse<InvoiceDetailResponse>> => {
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   const invoice = mockInvoices.find((inv) => inv.id === id);
//   if (invoice) {
//     return {
//       success: true,
//       data: invoice,
//       message: "Success",
//     };
//   }

//   return {
//     success: false,
//     data: null,
//     message: "Invoice not found",
//   };
// };

// export const createInvoiceMock = async (
//   data: InvoiceCreateRequest
// ): Promise<ApiResponse<InvoiceDetailResponse>> => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   const newInvoice: InvoiceDetailResponse = {
//     id: generateId(),
//     contractId: data.contractId,
//     roomId: "room-1", // Mock
//     billingPeriodStart: data.billingPeriodStart,
//     billingPeriodEnd: data.billingPeriodEnd,
//     dueDate: data.dueDate,
//     totalAmountDue: data.invoiceItems.reduce(
//       (sum, item) => sum + item.totalPrice,
//       0
//     ),
//     rentAmount:
//       data.invoiceItems.find((item) => item.itemType === InvoiceItemType.RENT)
//         ?.totalPrice || 0,
//     serviceAmount: data.invoiceItems
//       .filter((item) => item.itemType !== InvoiceItemType.RENT)
//       .reduce((sum, item) => sum + item.totalPrice, 0),
//     amountPaid: 0,
//     balanceRemaining: data.invoiceItems.reduce(
//       (sum, item) => sum + item.totalPrice,
//       0
//     ),
//     status: InvoiceStatus.SENT,
//     invoiceItems: data.invoiceItems.map((item) => ({
//       id: generateId(),
//       invoiceId: generateId(),
//       ...item,
//     })),
//     contract: {
//       id: data.contractId,
//       code: "HD-2024-XXX",
//       room: {
//         id: "room-1",
//         name: "Phòng 101",
//         property: {
//           id: "prop-1",
//           name: "Tòa nhà A",
//         },
//       },
//       primaryPropertyUser: {
//         id: "user-1",
//         fullName: "Nguyễn Văn A",
//         phone: "0901234567",
//       },
//     },
//     notes: data.notes,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   };

//   mockInvoices.push(newInvoice);

//   return {
//     success: true,
//     data: newInvoice,
//     message: "Invoice created successfully",
//   };
// };

// export const updateInvoiceMock = async (
//   id: string,
//   data: Partial<InvoiceCreateRequest>
// ): Promise<ApiResponse<InvoiceDetailResponse>> => {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   return {
//     success: false,
//     data: null,
//     message: "Not implemented",
//   };
// };

// export const deleteInvoiceMock = async (
//   id: string
// ): Promise<ApiResponse<boolean>> => {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   return {
//     success: false,
//     data: false,
//     message: "Not implemented",
//   };
// };

// export const getInvoicesByContractMock = async (
//   contractId: string,
//   queryKey?: BasePagingRequest
// ): Promise<ApiResponse<BasePagingResponse<InvoiceListResponse>>> => {
//   await new Promise((resolve) => setTimeout(resolve, 300));
//   return getListInvoiceMock(queryKey || { limit: 10, offset: 0 });
// };

// export const getInvoicesByRoomMock = async (
//   roomId: string,
//   queryKey?: BasePagingRequest
// ): Promise<ApiResponse<BasePagingResponse<InvoiceListResponse>>> => {
//   await new Promise((resolve) => setTimeout(resolve, 300));
//   return getListInvoiceMock(queryKey || { limit: 10, offset: 0 });
// };

// // Payment APIs
// export const createPaymentMock = async (
//   data: PaymentCreateRequest
// ): Promise<ApiResponse<PaymentResponse>> => {
//   await new Promise((resolve) => setTimeout(resolve, 800));

//   const newPayment: PaymentResponse = {
//     id: generateId(),
//     invoiceId: data.invoiceId,
//     contractId: data.contractId,
//     roomId: data.roomId,
//     amount: data.amount,
//     paymentDate: data.paymentDate,
//     paymentMethod: data.paymentMethod,
//     paymentFor: data.paymentFor,
//     note: data.note,
//     createdAt: new Date().toISOString(),
//   };

//   // Add to mock payments
//   if (data.invoiceId) {
//     if (!mockPayments[data.invoiceId]) {
//       mockPayments[data.invoiceId] = [];
//     }
//     mockPayments[data.invoiceId].push(newPayment);

//     // Update invoice
//     const invoice = mockInvoices.find((inv) => inv.id === data.invoiceId);
//     if (invoice) {
//       invoice.amountPaid += data.amount;
//       invoice.balanceRemaining -= data.amount;
//       if (invoice.balanceRemaining <= 0) {
//         invoice.status = InvoiceStatus.PAID;
//       } else {
//         invoice.status = InvoiceStatus.PARTIALLY_PAID;
//       }
//       invoice.updatedAt = new Date().toISOString();
//     }
//   }

//   return {
//     success: true,
//     data: newPayment,
//     message: "Payment created successfully",
//   };
// };

// export const getPaymentsByInvoiceMock = async (
//   invoiceId: string
// ): Promise<ApiResponse<PaymentResponse[]>> => {
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   return {
//     success: true,
//     data: mockPayments[invoiceId] || [],
//     message: "Success",
//   };
// };

// export const updatePaymentMock = async (
//   id: string,
//   data: Partial<PaymentCreateRequest>
// ): Promise<ApiResponse<PaymentResponse>> => {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   return {
//     success: false,
//     data: null,
//     message: "Not implemented",
//   };
// };

// export const deletePaymentMock = async (
//   id: string
// ): Promise<ApiResponse<boolean>> => {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   return {
//     success: false,
//     data: false,
//     message: "Not implemented",
//   };
// };

// // Utility Reading APIs
// export const createUtilityReadingMock = async (
//   data: UtilityReadingCreateRequest
// ): Promise<ApiResponse<UtilityReadingResponse>> => {
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   const newReading: UtilityReadingResponse = {
//     id: generateId(),
//     roomId: data.roomId,
//     serviceId: data.serviceId,
//     readingDate: data.readingDate,
//     readingValue: data.readingValue,
//     previousReadingValue: data.previousReadingValue,
//     usageAmount: data.usageAmount,
//     notes: data.notes,
//     createdAt: new Date().toISOString(),
//   };

//   mockUtilityReadings.push(newReading);

//   return {
//     success: true,
//     data: newReading,
//     message: "Utility reading created successfully",
//   };
// };

// export const getUtilityReadingsByRoomMock = async (
//   roomId: string,
//   serviceId?: string
// ): Promise<ApiResponse<UtilityReadingResponse[]>> => {
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   let readings = mockUtilityReadings.filter((r) => r.roomId === roomId);
//   if (serviceId) {
//     readings = readings.filter((r) => r.serviceId === serviceId);
//   }

//   return {
//     success: true,
//     data: readings,
//     message: "Success",
//   };
// };

// export const getLatestUtilityReadingMock = async (
//   roomId: string,
//   serviceId: string
// ): Promise<ApiResponse<UtilityReadingResponse>> => {
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   const readings = mockUtilityReadings
//     .filter((r) => r.roomId === roomId && r.serviceId === serviceId)
//     .sort(
//       (a, b) =>
//         new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime()
//     );

//   if (readings.length > 0) {
//     return {
//       success: true,
//       data: readings[0],
//       message: "Success",
//     };
//   }

//   return {
//     success: false,
//     data: null,
//     message: "No reading found",
//   };
// };
