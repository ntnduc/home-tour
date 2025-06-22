import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';

@ApiTags('location')
@Controller('api/location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('provinces')
  getComboProvinces() {
    return this.locationService.getComboProvinces();
  }

  @Get('districts/:provinceCode')
  getComboDistrictsFromProvinceCode(
    @Param('provinceCode') provinceCode: string,
  ) {
    return this.locationService.getComboDistrictsFromProvinceCode(provinceCode);
  }

  @Get('wards/:districtCode')
  getComboWardsFromDistrictCode(@Param('districtCode') districtCode: string) {
    return this.locationService.getComboWardsFromDistrictCode(districtCode);
  }
}
