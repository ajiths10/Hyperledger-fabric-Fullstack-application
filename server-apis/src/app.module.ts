import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AppService } from "./app.service";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { CarGarageModule } from "./car-garage/car-garage.module";
import { MotocycleGarageModule } from "./motocycle-garage/motocycle-garage.module";
import { PatientsModule } from "./patients/patients.module";
import { LedgerUtilsModule } from './ledger-utils/ledger-utils.module';
import { UtilsModule } from './utils/utils.module';
@Module({
    imports: [
        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),
        // BlockchainModule, // module only for learning and testing (will deprecate in the future)
        // CarGarageModule, // module only for learning and testing (will deprecate in the future)
        // MotocycleGarageModule, // module only for learning and testing (will deprecate in the future)
        PatientsModule,
        LedgerUtilsModule,
        UtilsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
