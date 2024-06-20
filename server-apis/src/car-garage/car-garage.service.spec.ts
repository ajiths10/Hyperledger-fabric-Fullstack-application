import { Test, TestingModule } from '@nestjs/testing';
import { CarGarageService } from './car-garage.service';

describe('CarGarageService', () => {
  let service: CarGarageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarGarageService],
    }).compile();

    service = module.get<CarGarageService>(CarGarageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
