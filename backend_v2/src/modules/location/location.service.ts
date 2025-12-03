import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Districts } from './entities/Districts.entity';
import { Provinces } from './entities/Provinces.entity';
import { Wards } from './entities/Wards.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Districts)
    private readonly districtsRepository: Repository<Districts>,
    @InjectRepository(Provinces)
    private readonly provincesRepository: Repository<Provinces>,
    @InjectRepository(Wards)
    private readonly wardsRepository: Repository<Wards>,
  ) {}

  async getComboProvinces() {
    const provinces = await this.provincesRepository.find();
    return provinces.map((province) => ({
      label: province.name,
      value: province.code,
    }));
  }

  async getComboDistrictsFromProvinceCode(provinceCode: string) {
    const districts = await this.districtsRepository.find({
      where: { province_code: provinceCode },
    });
    return districts.map((district) => ({
      label: district.full_name,
      value: district.code,
    }));
  }

  async getComboWardsFromDistrictCode(districtCode: string) {
    const wards = await this.wardsRepository.find({
      where: { district_code: districtCode },
    });
    return wards.map((ward) => ({
      label: ward.full_name,
      value: ward.code,
    }));
  }
}
