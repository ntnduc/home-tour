import { Ionicons } from "@expo/vector-icons";

export enum ServiceCalculateMethod {
  FIXED_PER_ROOM = "FIXED_PER_ROOM",
  FIXED_PER_PERSON = "FIXED_PER_PERSON",
  PER_UNIT_SIMPLE = "PER_UNIT_SIMPLE",
  PER_UNIT_TIERED = "PER_UNIT_TIERED",
  FREE = "FREE",
}

export const SERVICE_CALCULATE_METHOD_LABEL: Record<
  ServiceCalculateMethod,
  string
> = {
  [ServiceCalculateMethod.FIXED_PER_ROOM]: "Cố định theo phòng",
  [ServiceCalculateMethod.FIXED_PER_PERSON]: "Cố định theo người",
  [ServiceCalculateMethod.PER_UNIT_SIMPLE]: "Theo đơn vị đơn giản",
  [ServiceCalculateMethod.PER_UNIT_TIERED]: "Theo đơn vị phân cấp",
  [ServiceCalculateMethod.FREE]: "Miễn phí",
};

type IconName = keyof typeof Ionicons.glyphMap;

export const SERVICE_CALCULATE_METHOD_WITH_INFO: Record<
  ServiceCalculateMethod,
  { label: string; info: string; icon: IconName }
> = {
  [ServiceCalculateMethod.FIXED_PER_ROOM]: {
    label: "Cố định theo phòng",
    info: "Tính cố định cho mỗi phòng, không phụ thuộc vào số người hoặc mức sử dụng",
    icon: "home-outline",
  },
  [ServiceCalculateMethod.FIXED_PER_PERSON]: {
    label: "Cố định theo người",
    info: "Tính cố định cho mỗi người trong phòng",
    icon: "person-outline",
  },
  [ServiceCalculateMethod.PER_UNIT_SIMPLE]: {
    label: "Theo đơn vị",
    info: "Tính theo số đơn vị sử dụng, ví dụ: số điện, số nước",
    icon: "calculator-outline",
  },
  [ServiceCalculateMethod.PER_UNIT_TIERED]: {
    label: "Theo đơn vị phân cấp",
    info: "Tính theo bậc thang đơn vị, ví dụ: 0-50 số điện: 3.000đ/số, 51-100 số: 4.000đ/số",
    icon: "trending-up-outline",
  },
  [ServiceCalculateMethod.FREE]: {
    label: "Miễn phí",
    info: "Không tính phí dịch vụ này",
    icon: "gift-outline",
  },
};
