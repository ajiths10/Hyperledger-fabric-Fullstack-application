import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { LedgerUtilsModule } from 'src/ledger-utils/ledger-utils.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
    imports: [LedgerUtilsModule, UtilsModule],
    controllers: [PatientsController],
    providers: [PatientsService],
})
export class PatientsModule {}
