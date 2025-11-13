import { StatusOption } from "@/components/Status";
import { colors } from "@/theme/colors";
import { ContractStatus } from "@/types/contract";

export const CONTRACT_STATUS_OPTIONS: StatusOption[] = [
  {
    value: ContractStatus.PENDING_START,
    label: "Chờ bắt đầu",
    type: "info",
    textStyle: { color: colors.status.info },
  },
  {
    value: ContractStatus.ACTIVE,
    label: "Đang hiệu lực",
    type: "success",
    textStyle: { color: colors.status.success },
  },
  {
    value: ContractStatus.ENDED,
    label: "Đã kết thúc",
    type: "error",
    textStyle: { color: colors.status.error },
  },
  {
    value: ContractStatus.TERMINATED_EARLY,
    label: "Đã kết thúc sớm",
    type: "warning",
    textStyle: { color: colors.status.warning },
  },
  {
    value: ContractStatus.EXPIRED,
    label: "Hết hạn",
    type: "info",
    textStyle: { color: colors.status.info },
  },
];
