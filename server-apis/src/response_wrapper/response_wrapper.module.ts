import { Module } from '@nestjs/common';
import { ResponseWrapperService } from './response_wrapper.service';

@Module({
    providers: [ResponseWrapperService],
    exports: [ResponseWrapperService],
})
export class ResponseWrapperModule {}
