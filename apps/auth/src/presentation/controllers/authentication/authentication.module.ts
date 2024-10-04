import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import {
  LoginUserHandler,
  RefreshTokenHandler,
  RegisterUserHandler,
  ResetPasswordHandler,
  ResendVerificationEmailHandler,
  VerifyUserHandler,
} from "@app/auth/application/command-handlers";
import { CqrsModule } from "@nestjs/cqrs";

const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  ResetPasswordHandler,
  RefreshTokenHandler,
  ResendVerificationEmailHandler,
  VerifyUserHandler,
];
const QueryHandlers = [];

@Module({
  imports: [CqrsModule],
  controllers: [AuthenticationController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [],
})
export class AuthenticationModule {}
