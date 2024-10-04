import { UnauthorizedException } from "@nestjs/common";
import { ErrorType } from "../enums";

export class DisabledUserException extends UnauthorizedException {
  constructor(errorType: ErrorType, username) {
    super({
      errorType,
      message: "validation.login.user_inactive",
      args: {
        username: username,
      },
    });
  }
}
