import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { Logger, VersioningType } from "@nestjs/common";
import { APP_ROUTE_PREFIX, APP_VERSION, BODY_SIZE_LIMIT } from "@app/common";
import helmet from "helmet";
import { HttpResponseInterceptor } from "@app/common/interceptors/response";
import { HttpExceptionFilter } from "@app/common/filters";
import { SwaggerConfig } from "./infrastructure/config/swagger/swagger.config";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app
    .setGlobalPrefix(AuthModule.apiPrefix || APP_ROUTE_PREFIX)
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: AuthModule.apiVersion || APP_VERSION,
    })
    .enableCors({
      origin: ["*"],
      credentials: true,
    });
  app
    .use(helmet())
    .use(compression())
    .use(cookieParser())
    .use(bodyParser.json({ limit: BODY_SIZE_LIMIT }))
    .use(bodyParser.urlencoded({ limit: BODY_SIZE_LIMIT, extended: true }))
    .useGlobalInterceptors(new HttpResponseInterceptor())
    .useGlobalFilters(new HttpExceptionFilter(AuthModule.logger));

  SwaggerConfig(app);

  await app.listen(AuthModule.port, "0.0.0.0");
  return AuthModule.port;
}
bootstrap().then((port: number) => {
  Logger.log(`Authentication Service running on port: ${port}`, "Main");
});
