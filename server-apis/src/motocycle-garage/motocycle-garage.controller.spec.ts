import { Test, TestingModule } from '@nestjs/testing';
import { MotocycleGarageController } from './motocycle-garage.controller';
import { MotocycleGarageService } from './motocycle-garage.service';

describe('MotocycleGarageController', () => {
  let controller: MotocycleGarageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotocycleGarageController],
      providers: [MotocycleGarageService],
    }).compile();

    controller = module.get<MotocycleGarageController>(MotocycleGarageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
