import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeleteResult } from 'typeorm';

@Injectable()
export class ResInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (
          response?.response instanceof DeleteResult &&
          response?.response.affected < 1
        ) {
          throw new HttpException(
            {
              status: false,
              message: 'did not delete any resource',
            },
            HttpStatus.EXPECTATION_FAILED,
          );
        }

        if (typeof response === 'string') {
          return {
            status: true,
            message: response,
          };
        }

        return response;
      }),
    );
  }
}
