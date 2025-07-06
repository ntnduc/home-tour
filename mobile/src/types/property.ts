import { Service, ServiceCreateRequest } from "./service";

export enum PropertyRoomsStatus {
  FULL = "FULL",
  EMPTY = "EMPTY",
  PARTIAL = "PARTIAL",
}

export interface Property {
  id: string;
  name: string;
  address: string;
  defaultRoomRent: number;
  paymentDate: number;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  numberFloor?: number;
  totalRoom: number;
  images: string[];
  services: Service[];
}

export interface PropertyCreateRequest
  extends Omit<Property, "id" | "services"> {
  services: ServiceCreateRequest[];
}

export interface PropertyListRequest {
  page?: number;
  pageSize?: number;
  globalSearch?: string;
}

export interface PropertyListResponse extends Property {
  statusRooms?: PropertyRoomsStatus;
  totalRoomOccupied?: number;
}
