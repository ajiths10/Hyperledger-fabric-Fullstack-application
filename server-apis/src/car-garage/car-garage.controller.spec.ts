import { Test, TestingModule } from '@nestjs/testing';
import { CarGarageController } from './car-garage.controller';
import { CarGarageService } from './car-garage.service';

describe('CarGarageController', () => {
  let controller: CarGarageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarGarageController],
      providers: [CarGarageService],
    }).compile();

    controller = module.get<CarGarageController>(CarGarageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
