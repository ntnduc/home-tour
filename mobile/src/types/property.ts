import { Service, ServiceCreateOrUpdateRequest } from "./service";

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
  services: ServiceCreateOrUpdateRequest[];
}

export interface PropertyUpdateRequest extends Omit<Property, "services"> {
  services: ServiceCreateOrUpdateRequest[];
}

export interface PropertyDetail extends Property {
  services: Service[];
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

export function mapPropertyDetailToUpdateRequest(
  propertyDetail: PropertyDetail
): PropertyUpdateRequest {
  return {
    ...propertyDetail,
    services: propertyDetail.services.map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price,
      icon: service.icon,
      calculationMethod: service.calculationMethod,
    })),
  };
}
