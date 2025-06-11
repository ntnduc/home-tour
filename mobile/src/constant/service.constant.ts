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
