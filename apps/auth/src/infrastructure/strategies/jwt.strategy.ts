import { JwtPayload } from "@app/auth/domain/adapters";
import { IUserAccountRepository } from "@app/auth/domain/repositories";
import {
  DisabledUserException,
  ErrorType,
  InvalidCredentialsException,
  JWTConfig,
  UserAccount,
  UserAccountStatus,
} from "@app/common";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userAccountRepository: IUserAccountRepository,
    private readonly jwtConfig: JWTConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.getJwtSecret(),
    });
  }

  async validate(payload: JwtPayload): Promise<UserAccount> {
    const { uuid } = payload;

    const userAccount = undefined;

    if (!userAccount) {
      throw new InvalidCredentialsException();
    }
    if (userAccount.status == UserAccountStatus.INACTIVE) {
      throw new DisabledUserException(ErrorType.InactiveUser, `${userAccount.firstName} ${userAccount.lastName}`);
    }
    if (userAccount.status == UserAccountStatus.SUSPENDED) {
      throw new DisabledUserException(ErrorType.BlockedUser, `${userAccount.firstName} ${userAccount.lastName}`);
    }
    return userAccount;
  }
}
