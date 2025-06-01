export interface ProvinceDto {
  id: number;
  name: string;
  code: string;
}

export interface DistrictDto {
  id: number;
  name: string;
  code: string;
  provinceId: number;
}

export interface WardDto {
  id: number;
  name: string;
  code: string;
  districtId: number;
}
