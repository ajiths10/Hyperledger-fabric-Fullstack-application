import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";

@Injectable()
export class CatchFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!(exception instanceof HttpException)) {
      this.logger.error(exception);

      res.status(statusCode).json({
        status: false,
        message: "Internal Server Error",
      });
    }

    if (exception instanceof HttpException) {
      const r = exception.getResponse();

      switch (statusCode) {
        case HttpStatus.BAD_REQUEST:
          res.status(statusCode).json({
            status: false,
            message: "Validation failed",
            validationErrors: (r as any).message,
          });

          break;
        default:
          const message =
            typeof r === "string" ? r : (r as any).message || (r as any).error;

          res.status(statusCode).json({
            status: false,
            message,
          });
      }
    }
  }
}
