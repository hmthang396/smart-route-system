import { Inject, Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { AbstractRepository, DataSource, EntityManager, Repository } from "typeorm";
import { UserLoginDataEntity } from "../entities";
import { IUserLoginDataRepository } from "@app/auth/domain/repositories";
import { UserLoginData } from "@app/common";

@Injectable()
export class UserLoginDataRepository
  extends AbstractRepository<UserLoginDataEntity>
  implements IUserLoginDataRepository
{
  constructor(
    @Inject("LocalStorage")
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }
  get userLoginDataRepository(): Repository<UserLoginDataEntity> {
    const storage = this.localStorage.getStore();
    if (storage && storage.has("typeOrmEntityManager")) {
      return storage.get("typeOrmEntityManager").getRepository(UserLoginDataEntity);
    }
    return this.dataSource.getRepository(UserLoginDataEntity);
  }
  getEntityManager(): EntityManager {
    return this.userLoginDataRepository.manager;
  }
  async createUserLoginData(dto: Pick<UserLoginData, "email" | "passwordHash">): Promise<UserLoginData> {
    const entity = await this.userLoginDataRepository.save(new UserLoginDataEntity({ ...dto }));

    return entity?.toModel();
  }
  async findByEmail(email: string): Promise<UserLoginData> {
    const entity = await this.userLoginDataRepository.findOne({
      where: {
        email,
        deletedAt: null,
      },
    });

    return entity?.toModel();
  }
  async updatePasswordRecoveryToken(email: string, token: string, expiration: Date): Promise<boolean> {
    const result = await this.userLoginDataRepository.update(
      {
        email,
      },
      {
        passwordRecoveryToken: token,
        recoveryTokenTime: expiration,
      },
    );
    return !!result.affected;
  }
  async updateUserLoginData(userLoginData: UserLoginData): Promise<boolean> {
    const result = await this.userLoginDataRepository.update(
      {
        // id: userLoginData.id,
        userId: userLoginData.userId,
      },
      {
        passwordHash: userLoginData.passwordHash,
        emailStatus: userLoginData.emailStatus,
        passwordRecoveryToken: userLoginData.passwordRecoveryToken,
        confirmationToken: userLoginData.confirmationToken,
        isTwoFactorEnabled: userLoginData.isTwoFactorEnabled,
        isTwoFactorVerified: userLoginData.isTwoFactorVerified,
        twoFactorSecret: userLoginData.twoFactorSecret,
      },
    );

    return !!result.affected;
  }
}
