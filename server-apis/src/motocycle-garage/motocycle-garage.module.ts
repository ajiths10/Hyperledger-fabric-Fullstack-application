import { Module } from '@nestjs/common';
import { MotocycleGarageService } from './motocycle-garage.service';
import { MotocycleGarageController } from './motocycle-garage.controller';

@Module({
  controllers: [MotocycleGarageController],
  providers: [MotocycleGarageService],
})
export class MotocycleGarageModule {}
