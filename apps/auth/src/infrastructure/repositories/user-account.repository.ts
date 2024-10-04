import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { AbstractRepository, DataSource, EntityManager, Repository } from "typeorm";
import { UserAccountEntity } from "../entities";
import { AsyncLocalStorage } from "async_hooks";
import { UserAccount, UserAccountStatus, UserLoginData } from "@app/common";
import { IUserAccountRepository } from "../../domain/repositories";

@Injectable()
export class UserAccountRepository extends AbstractRepository<UserAccountEntity> implements IUserAccountRepository {
  constructor(
    @Inject("LocalStorage")
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }
  async findOneByConfirmationToken(token: string): Promise<UserAccount> {
    const entity = await this.userAccountEntityRepository.findOne({
      where: {
        userLoginData: {
          confirmationToken: token,
        },
      },
      relations: {
        userLoginData: true,
      },
    });

    if (!entity) return null;

    return entity.toModel();
  }

  async markAsActive(uuid: string) {
    await this.userAccountEntityRepository.update(
      {
        uuid,
      },
      {
        status: UserAccountStatus.ACTIVE,
      },
    );
  }

  getEntityManager(): EntityManager {
    return this.userAccountEntityRepository.manager;
  }

  async findOneByEmail(email: string): Promise<UserAccount> {
    const entity = await this.userAccountEntityRepository.findOne({
      where: {
        userLoginData: {
          email,
        },
      },
      relations: {
        userLoginData: true,
      },
    });

    if (!entity) return null;

    return entity.toModel();
  }

  async findOneByUUID(uuid: string): Promise<UserAccount> {
    const entity = await this.userAccountEntityRepository.findOne({
      where: {
        uuid,
      },
      relations: {
        userLoginData: true,
      },
    });

    if (!entity) return null;

    return entity.toModel();
  }

  async createUserAccount(dto: {
    userLogin: Partial<UserLoginData>;
    userAccount: Partial<UserAccount>;
  }): Promise<UserAccount> {
    let userAccount = new UserAccount();
    // let userLoginData = new UserLoginData();

    const user = await this.findOneByEmail(dto.userLogin.email);

    if (!!user) {
      throw new BadRequestException("Email is already in use");
    }

    const userAccountEntity = await this.userAccountEntityRepository.save(
      new UserAccountEntity({ ...dto.userAccount, userLoginData: undefined }),
    );

    userAccount = userAccountEntity.toModel();

    // await this.userAccountEntityRepository.manager.transaction(async (transactionalEntityManager) => {
    //   const user = await this.findOneByEmail(dto.userLogin.email);

    //   if (!!user) {
    //     throw new BadRequestException("Email is already in use");
    //   }
    //   const userAccountEntity = (await transactionalEntityManager.save(
    //     new UserAccountEntity({ ...dto.userAccount, userLoginData: undefined }),
    //   )) as UserAccountEntity;

    //   dto.userLogin.userAccountId = userAccountEntity.id;

    //   const userLoginDataEntity = (await transactionalEntityManager.save(
    //     new UserLoginDataEntity({ ...dto.userLogin }),
    //   )) as UserLoginDataEntity;

    //   userAccount = userAccountEntity.toModel();
    //   userLoginData = userLoginDataEntity.toModel();
    // });

    // userAccount.userLoginData = userLoginData;

    return userAccount;
  }

  get userAccountEntityRepository(): Repository<UserAccountEntity> {
    const storage = this.localStorage.getStore();
    if (storage && storage.has("typeOrmEntityManager")) {
      return storage.get("typeOrmEntityManager").getRepository(UserAccountEntity);
    }
    return this.dataSource.getRepository(UserAccountEntity);
  }
}
