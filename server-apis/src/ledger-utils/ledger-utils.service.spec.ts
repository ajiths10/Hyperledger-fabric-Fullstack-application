import { Test, TestingModule } from '@nestjs/testing';
import { LedgerUtilsService } from './ledger-utils.service';

describe('LedgerUtilsService', () => {
    let service: LedgerUtilsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LedgerUtilsService],
        }).compile();

        service = module.get<LedgerUtilsService>(LedgerUtilsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
