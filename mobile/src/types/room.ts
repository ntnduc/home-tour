import { PropertyDetail } from "./property";

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
