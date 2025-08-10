import { PropertyDetail } from "./property";
import { PropertyServiceDetail } from "./property-service";

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE",
  PENDING_DEPOSIT = "PENDING_DEPOSIT",
  UNAVAILABLE = "UNAVAILABLE",
}

export interface Room {
  id: string;
  name: string;
  propertyId: string;
  rentAmount: number;
  maxOccupancy?: number;
  status: RoomStatus;
  floor?: string;
  defaultDepositAmount: number;
  defaultPaymentDueDay: number;
  description?: string;
  area?: number;
  property?: PropertyDetail;
}

export interface RoomListResponse extends Room {}

export interface RoomDetailResponse extends Room {
  propertyName?: string;
}

export interface RoomUpdateRequest extends Room {
  propertyName?: string;
}

export interface RoomServiceDetailResponse extends RoomDetailResponse {
  services: PropertyServiceDetail[];
  property: PropertyDetail;
}
