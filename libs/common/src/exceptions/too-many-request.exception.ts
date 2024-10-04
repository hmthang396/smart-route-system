import { BadRequestException } from "@nestjs/common";
import { ErrorType } from "../enums";

export class TooManyRequestException extends BadRequestException {
  constructor() {
    super({
      errorType: ErrorType.TooManyRequests,
      message: `Too many requests`,
    });
  }
}
