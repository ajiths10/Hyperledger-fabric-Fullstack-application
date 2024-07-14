import { Module } from '@nestjs/common';
import { LedgerUtilsService } from './ledger-utils.service';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
    imports: [UtilsModule],
    providers: [LedgerUtilsService],
    exports: [LedgerUtilsService],
})
export class LedgerUtilsModule {}
