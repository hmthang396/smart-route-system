import {
  ForgotPasswordCommand,
  LoginUserCommand,
  RefreshTokenCommand,
  RegisterUserCommand,
  ResendVerificationEmailCommand,
  VerifyUserCommand,
} from "@app/auth/application/commands";
import {
  AuthCredentialsRequestDto,
  ForgotPasswordRequestDto,
  LoginResponseDto,
  ResendVerificationEmailRequestDto,
  RegisterUserRequestDto,
  UserAccountResponseDto,
  VerifyAccountRequestDto,
} from "@app/auth/application/dtos";
import { ApiGlobalResponse, SuccessResponseDto } from "@app/common";
import { Body, Controller, HttpCode, Post, ValidationPipe, Request, Param, Get } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserAccountMapper } from "../../mapper";

@Controller("authentication")
export class AuthenticationController {
  constructor(private commandBus: CommandBus) {}

  @ApiGlobalResponse(UserAccountResponseDto)
  @ApiOperation({ description: "User Register" })
  @Post("register")
  @HttpCode(200)
  // @SkipAuth()
  async register(@Body(ValidationPipe) registerDto: RegisterUserRequestDto) {
    const userAccount = await this.commandBus.execute(
      new RegisterUserCommand(registerDto.userAccount, registerDto.userLogin),
    );

    return UserAccountMapper.toDto(userAccount);
  }

  @ApiGlobalResponse(LoginResponseDto)
  @ApiOperation({ description: "User authentication" })
  @Post("/login")
  @HttpCode(200)
  // @SkipAuth()
  public async login(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsRequestDto): Promise<LoginResponseDto> {
    const { token, user } = await this.commandBus.execute(
      new LoginUserCommand(authCredentialsDto.email, authCredentialsDto.password),
    );

    return {
      token: token,
      user: UserAccountMapper.toDto(user),
    };
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: "User refresh token" })
  @ApiUnauthorizedResponse({ description: "Refresh token invalid or expired" })
  @ApiOkResponse({ description: "token successfully renewed" })
  @ApiInternalServerErrorResponse({ description: "Server error" })
  @Post("/refresh-token")
  @HttpCode(200)
  // @SkipAuth()
  // @UseGuards(JwtRefreshGuard)
  public async refreshToken(@Request() request: any) {
    return await this.commandBus.execute(new RefreshTokenCommand(request.user, request.jwtPayload));
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: "Create Link Reset Password and Send Email" })
  @Post("/forgot-password")
  @HttpCode(200)
  // @SkipAuth()
  public async resetPasswordCreate(
    @Body(ValidationPipe)
    forgotPasswordRequestDto: ForgotPasswordRequestDto,
  ): Promise<SuccessResponseDto> {
    return await this.commandBus.execute(new ForgotPasswordCommand(forgotPasswordRequestDto.email));
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: "Resend-verification Email and Account" })
  @Post("/reverify")
  @HttpCode(200)
  // @SkipAuth()
  async reverifyAccount(
    @Body(ValidationPipe)
    resendVerificationEmailRequestDto: ResendVerificationEmailRequestDto,
  ): Promise<SuccessResponseDto> {
    const result = await this.commandBus.execute(
      new ResendVerificationEmailCommand(resendVerificationEmailRequestDto.email),
    );
    return { result };
  }

  @ApiGlobalResponse(SuccessResponseDto)
  @ApiOperation({ description: "Verify Email and Account" })
  @Get("/verify-account/:token")
  @HttpCode(200)
  // @SkipAuth()
  async verifyAccount(@Param() params: VerifyAccountRequestDto): Promise<SuccessResponseDto> {
    const result = await this.commandBus.execute(new VerifyUserCommand(params.token));
    return { result };
  }
}
