import { Service, ServiceCreateRequest } from "./service";

export interface Property {
  id: number;
  name: string;
  address: string;
  defaultRoomRent: number;
  paymentDate: number;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  images: string[];
  services: Service[];
}

export interface PropertyCreateRequest
  extends Omit<Property, "id" | "services"> {
  services: ServiceCreateRequest[];
}
