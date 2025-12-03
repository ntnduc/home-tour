import { StatusOption } from "@/components/Status";
import { colors } from "@/theme/colors";
import { RoomStatus } from "@/types/room";

export const ROOM_STATUS_OPTIONS: StatusOption[] = [
  {
    value: RoomStatus.AVAILABLE,
    label: "Trống",
    type: "warning",
    textStyle: { color: colors.status.warning },
  },
  {
    value: RoomStatus.OCCUPIED,
    label: "Đang thuê",
    type: "success",
    textStyle: { color: colors.status.success },
  },
  {
    value: RoomStatus.MAINTENANCE,
    label: "Đang sửa",
    type: "warning",
    textStyle: { color: colors.status.warning },
  },
  // {
  //   value: RoomStatus.PENDING_DEPOSIT,
  //   label: "Chờ gửi tiền",
  //   type: "info",
  //   textStyle: { color: colors.status.info },
  // },
  {
    value: RoomStatus.UNAVAILABLE,
    label: "Không hoạt động",
    type: "error",
    textStyle: { color: colors.status.error },
  },
];
