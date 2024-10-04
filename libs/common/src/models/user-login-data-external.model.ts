import { ExternalProvider } from "./external-provider.model";
import { UserAccount } from "./user-account.model";

export class UserLoginExternal {
  constructor(data?: Partial<UserLoginExternal>) {
    Object.assign(this, { ...data });
  }

  userId: number;
  uuid: string;
  userAccountId: number;
  externalProviderId: number;
  externalProviderToken: string;
  user: UserAccount;
  externalProvider: ExternalProvider;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
