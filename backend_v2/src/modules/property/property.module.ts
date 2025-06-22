import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Properties } from './entities/properties.entity';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';

@Module({
  imports: [TypeOrmModule.forFeature([Properties])],
  providers: [PropertyService],
  exports: [PropertyService],
  controllers: [PropertyController],
})
export class PropertyModule {}
