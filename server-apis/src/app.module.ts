import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AppService } from "./app.service";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { CarGarageModule } from "./car-garage/car-garage.module";
import { MotocycleGarageModule } from "./motocycle-garage/motocycle-garage.module";
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    BlockchainModule,
    CarGarageModule,
    MotocycleGarageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
