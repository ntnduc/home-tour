import { CreatePropertyServiceRequest } from "./property.service.dto";

export class CreatePropertyRequest {
  name: string;
  address: string;
  provinceCode: number;
  districtCode: number;
  wardCode: number;
  latitude?: number;
  longitude?: number;
  defaultRoomRent: number;
  propertyServices?: CreatePropertyServiceRequest[];

  toEntity() {
    return {
      ...this,
      provinceCode: this.provinceCode.toString(),
      districtCode: this.districtCode.toString(),
      wardCode: this.wardCode.toString(),
    };
  }
}

export class DetailPropertyResponse {
  id: number;
  name: string;
  address: string;
  provinceCode: number;
  districtCode: number;
  wardCode: number;
  latitude: number;
  longitude: number;
  defaultRoomRent: number;
  propertyServices: CreatePropertyServiceRequest[];
  createdAt: Date;
  updatedAt: Date;
}
