import { UnauthorizedException } from "@nestjs/common";
import { ErrorType } from "../enums";

export class NotAuthenticatedTwofa extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.NotAuthenticatedTwofa,
      message: "You are not authenticated with 2FA",
    });
  }
}
