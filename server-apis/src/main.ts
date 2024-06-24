import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { useContainer } from "class-validator";
import { CatchFilter } from "./catch.interceptor";
import { ResInterceptor } from "./res.interceptor";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific options
  app.enableCors({
    // origin: process.env.APP_CORS_ORIGINS.split(','),
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.use(helmet());
  app.setGlobalPrefix("api/v1");

  // Apply strict validation and transformation to incoming requests globally.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transform incoming data according to DTO class.
      whitelist: true, // Only allow properties defined in the DTO.
      forbidUnknownValues: true, // Reject unknown properties in the payload.
      forbidNonWhitelisted: true, // Reject properties not defined in DTO.
      stopAtFirstError: true, // Stop validation at first error encountered.
    })
  );

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true, // If an error occurs while resolving dependencies, fallback to default behavior.
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ResInterceptor());
  app.useGlobalFilters(new CatchFilter());

  app.useGlobalFilters();

  await app.listen(process.env.SERVER_PORT || 4000);
}
bootstrap();
