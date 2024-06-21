import { Test, TestingModule } from '@nestjs/testing';
import { MotocycleGarageService } from './motocycle-garage.service';

describe('MotocycleGarageService', () => {
  let service: MotocycleGarageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MotocycleGarageService],
    }).compile();

    service = module.get<MotocycleGarageService>(MotocycleGarageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
