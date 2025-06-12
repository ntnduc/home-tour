import { Properties } from "../../entities/Properties";
import { CreatePropertyServiceRequest } from "./property.service.dto";

export class CreatePropertyRequest {
  name: string;
  address: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  latitude?: number;
  longitude?: number;
  defaultRoomRent: number;
  paymentDate: number;
  services?: CreatePropertyServiceRequest[];

  toEntity(): Properties {
    const property = new Properties();
    property.name = this.name;
    property.address = this.address;
    property.provinceCode = this.provinceCode;
    property.districtCode = this.districtCode;
    property.wardCode = this.wardCode;
    property.defaultRoomRent = this.defaultRoomRent;
    property.paymentDate = this.paymentDate;
    property.latitude = this.latitude;
    property.longitude = this.longitude;
    return property;
  }
}

export class DetailPropertyResponse {
  id: number;
  name: string;
  address: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  latitude: number;
  longitude: number;
  defaultRoomRent: number;
  propertyServices: CreatePropertyServiceRequest[];
  createdAt: Date;
  updatedAt: Date;
}
