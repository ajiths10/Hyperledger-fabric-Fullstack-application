import { Module } from "@nestjs/common";
import { LedgerUtilsService } from "./ledger-utils.service";

@Module({
    providers: [LedgerUtilsService],
    exports: [LedgerUtilsService],
})
export class LedgerUtilsModule {}
