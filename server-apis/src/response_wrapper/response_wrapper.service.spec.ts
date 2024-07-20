import { Test, TestingModule } from '@nestjs/testing';
import { ResponseWrapperService } from './response_wrapper.service';

describe('ResponseWrapperService', () => {
  let service: ResponseWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseWrapperService],
    }).compile();

    service = module.get<ResponseWrapperService>(ResponseWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
