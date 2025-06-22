import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Districts } from './entities/Districts.entity';
import { Provinces } from './entities/Provinces.entity';
import { Wards } from './entities/Wards.entity';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([Districts, Provinces, Wards])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
