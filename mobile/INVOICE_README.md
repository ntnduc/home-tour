XỬ LÝ HÓA ĐƠN
Ba trường hợp này được phân biệt chủ yếu dựa trên Leases.StartDate và Leases.Status, cùng với việc xử lý hóa đơn và thanh toán ngay lập tức.
Trường hợp 1: Hợp đồng được kích hoạt ngay lập tức và thanh toán tiền phòng trước (Pre-paid)
1. Thao tác Người dùng:
    ◦ Đặt Leases.StartDate là ngày hiện tại hoặc ngày trong quá khứ gần nhất.
    ◦ Nhập DepositAmountPaid và khoản tiền thanh toán cho kỳ thuê đầu tiên.
2. Hành động của Hệ thống:
    ◦ Kích hoạt Hợp đồng: Ngay lập tức chuyển Leases.Status thành ACTIVE.
    ◦ Cập nhật Phòng: Chuyển Rooms.Status thành OCCUPIED.
    ◦ Tạo Hóa đơn (Kỳ 1 - Thanh toán trước):
        ▪ Tạo một bản ghi mới trong bảng Invoices.
        ▪ BillingPeriodStart là Leases.StartDate.
        ▪ BillingPeriodEnd là một tháng sau StartDate (hoặc theo chu kỳ thuê).
        ▪ DueDate là Leases.StartDate (hoặc ngày lập hóa đơn).
        ▪ Status ban đầu là SENT hoặc DRAFT.
    ◦ Ghi nhận Thanh toán: Ghi nhận khoản tiền đã thu (tiền thuê kỳ 1) vào bảng Payments, liên kết đến InvoiceID vừa tạo.
    ◦ Xử lý Cọc: Ghi nhận khoản tiền cọc vào bảng Payments với PaymentFor = 'DEPOSIT' (nếu có).
Trường hợp 2: Hợp đồng chưa tới ngày hiệu lực nhưng có tiền cọc
1. Thao tác Người dùng:
    ◦ Đặt Leases.StartDate là một ngày trong tương lai.
    ◦ Nhập DepositAmountPaid > 0.
2. Hành động của Hệ thống:
    ◦ Trạng thái Hợp đồng: Leases.Status vẫn là PENDING_START.
    ◦ Trạng thái Phòng: Rooms.Status được cập nhật thành PENDING_DEPOSIT (Chờ cọc).
    ◦ Xử lý Cọc: Ghi nhận khoản tiền cọc vào bảng Payments với PaymentFor = 'DEPOSIT', không cần tạo InvoiceID ngay lập tức.
Trường hợp 3: Hợp đồng đã có hiệu lực/chưa có hiệu lực nhưng thanh toán tiền phòng sau (Post-paid)
1. Thao tác Người dùng:
    ◦ Đặt Leases.StartDate (có thể là quá khứ, hiện tại, hoặc tương lai).
    ◦ Đặt PaymentDueDay trong Leases là một ngày sau khi kỳ thanh toán kết thúc (ví dụ: thu tiền tháng 7 vào ngày 5 tháng 8).
2. Hành động của Hệ thống:
    ◦ Kích hoạt: Nếu StartDate đến, Leases.Status chuyển thành ACTIVE và Rooms.Status chuyển thành OCCUPIED.
    ◦ Tạo Hóa đơn: Hóa đơn chỉ được tạo vào ngày định sẵn trong tháng tiếp theo, và kỳ thanh toán sẽ là quá khứ (xem Phần IV).

--------------------------------------------------------------------------------
III. NHẬP CHỈ SỐ ĐIỆN NƯỚC (UtilityReadings)
Quản lý nhà trọ cần có quyền "RECORD_UTILITY_READING".
1. Ghi chỉ số Lần đầu (Khi Hợp đồng bắt đầu)
Thao tác này áp dụng cho các phòng có dịch vụ tính phí theo đơn vị (ví dụ: Điện, Nước) với CalculationMethod là PER_UNIT_SIMPLE hoặc PER_UNIT_TIERED.
1. Thao tác Người dùng:
    ◦ Nhập một bản ghi mới vào bảng UtilityReadings.
    ◦ ReadingDate: Ngày bắt đầu hợp đồng (hoặc ngày ghi chỉ số).
    ◦ ReadingValue: Chỉ số mới trên đồng hồ.
    ◦ PreviousReadingValue: Nếu đây là lần đầu tiên phòng có chỉ số, trường này có thể được nhập là 0 hoặc NULL.
    ◦ Ghi RoomID, ServiceID, và RecordedByUserID.
2. Hành động của Hệ thống:
    ◦ UsageAmount sẽ là 0 hoặc NULL vì chưa có chỉ số cũ để tính toán.
2. Ghi chỉ số Định kỳ (Chuẩn bị cho Hóa đơn)
1. Thao tác Người dùng:
    ◦ Quản lý nhà trọ nhập bản ghi UtilityReadings mới vào cuối kỳ (ví dụ: ngày 30 hoặc 31 hàng tháng).
    ◦ Nhập ReadingValue mới.
2. Hành động của Hệ thống:
    ◦ Hệ thống tự động tìm kiếm bản ghi UtilityReadings gần nhất cho cùng RoomID và ServiceID.
    ◦ Tự động điền PreviousReadingValue (chính là ReadingValue của kỳ trước).
    ◦ Tính toán UsageAmount = ReadingValue - PreviousReadingValue.

--------------------------------------------------------------------------------
IV. TỚI HẠN THANH TOÁN VÀ TẠO HÓA ĐƠN
Việc tạo hóa đơn (Generation) xảy ra khi hợp đồng đang ở trạng thái ACTIVE.
1. Luồng Tạo Hóa đơn Tự động
1. Xác định Thời điểm Tạo:
    ◦ Hệ thống kiểm tra các hợp đồng đang ACTIVE.
    ◦ Hệ thống chạy quy trình tạo hóa đơn vào ngày được cấu hình, thường là gần ngày PaymentDueDay được quy định trong Leases.
2. Tính toán Kỳ Thanh toán (Billing Period):
Loại Thanh toán
Ngày tạo Hóa đơn (Ví dụ)
BillingPeriodStart / End
Logic về kỳ thanh toán
Thanh toán Trước (Pre-paid)
Ngày 28/07
01/08 / 31/08
Hóa đơn được tạo để thu tiền cho kỳ tương lai (tháng 8).
Thanh toán Sau (Post-paid)
Ngày 01/08
01/07 / 31/07
Hóa đơn được tạo để thu tiền cho kỳ đã qua (tháng 7).
3. Chi tiết Hóa đơn (InvoiceItems): Hệ thống tạo các mục chi tiết:
    ◦ Tiền thuê: Tính dựa trên Leases.RentAmountAgreed.
    ◦ Tiền dịch vụ (Cố định): Tính dựa trên cấu hình dịch vụ theo phòng/hợp đồng.
    ◦ Tiền dịch vụ (Theo đơn vị): Lấy UsageAmount từ bảng UtilityReadings (đã ghi chỉ số) và áp dụng giá bậc thang từ TieredPricing.
    ◦ Mục chi tiết này phải liên kết đến bản ghi chỉ số đã sử dụng thông qua InvoiceItems.ReadingID.
4. Hoàn tất Hóa đơn: Hệ thống tính toán TotalAmountDue (bao gồm cả PreviousBalance nếu có).
5. Trạng thái Hóa đơn: Hóa đơn được đặt trạng thái SENT.
2. Ghi nhận Thanh toán
1. Thao tác Người dùng (Kế toán/Quản lý): Sau khi nhận tiền, người dùng thực hiện ghi nhận thanh toán vào bảng Payments.
    ◦ Liên kết Payments.InvoiceID với hóa đơn đang chờ thanh toán.
    ◦ Nhập Amount (số tiền đã thanh toán), PaymentDate, PaymentMethod và ReceivedByUserID.
2. Hành động của Hệ thống:
    ◦ Hệ thống cập nhật Invoices.AmountPaid.
    ◦ Hệ thống tính toán lại Invoices.BalanceRemaining (tính toán tự động).
    ◦ Nếu BalanceRemaining = 0, hệ thống chuyển Invoices.Status sang PAID. Nếu còn nợ, có thể là PARTIALLY_PAID.