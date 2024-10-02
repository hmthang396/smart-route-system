import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const AUTH_OPTIONS: SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "Bearer",
};

export const TOKEN_NAME = "access-token";

const title = "Nestjs Framework";
const description =
  "This is a basic Nest boilerplate project built on the more powerful node.js framework. " +
  "The main purpose of this project is to dynamically handle roles and permissions assigned to the user.";

/**
 * Setup swagger in the application
 * @param app {INestApplication}
 */
export const SwaggerConfig = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .addBearerAuth(AUTH_OPTIONS, TOKEN_NAME)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`/:version/swagger`, app, document);
};
