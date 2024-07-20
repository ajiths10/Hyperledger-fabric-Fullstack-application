import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { LedgerUtilsModule } from 'src/ledger-utils/ledger-utils.module';
import { UtilsModule } from 'src/utils/utils.module';
import { ResponseWrapperModule } from 'src/response_wrapper/response_wrapper.module';

@Module({
    imports: [LedgerUtilsModule, UtilsModule, ResponseWrapperModule],
    controllers: [PatientsController],
    providers: [PatientsService],
})
export class PatientsModule {}
