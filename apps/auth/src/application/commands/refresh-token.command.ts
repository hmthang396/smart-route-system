import { JwtPayload } from "@app/auth/domain/adapters";
import { UserAccount } from "@app/common";

export class RefreshTokenCommand {
  constructor(
    public readonly user: UserAccount,
    public readonly payload: JwtPayload,
  ) {}
}
