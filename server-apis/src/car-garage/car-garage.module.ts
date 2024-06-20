import { Module } from '@nestjs/common';
import { CarGarageService } from './car-garage.service';
import { CarGarageController } from './car-garage.controller';

@Module({
  controllers: [CarGarageController],
  providers: [CarGarageService],
})
export class CarGarageModule {}
