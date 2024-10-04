import { IUnitOfWork } from "@app/auth/domain/unit-of-work/unit-of-work.service";
import { Inject } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { DataSource, EntityManager } from "typeorm";
import { UserAccountRepository } from "../repositories/user-account.repository";
import { UserLoginDataRepository } from "../repositories/user-login-data.repository";
import { IOutboxRepository, IUserAccountRepository, IUserLoginDataRepository } from "@app/auth/domain/repositories";
import { OutboxRepository } from "../repositories/outbox.repository";

export class UnitOfWork implements IUnitOfWork {
  constructor(
    private readonly dataSource: DataSource,
    @Inject("LocalStorage")
    private readonly _asyncLocalStorage: AsyncLocalStorage<any>,
    @Inject(UserAccountRepository)
    private readonly userAccountRepository: IUserAccountRepository,
    @Inject(UserLoginDataRepository)
    private readonly userLoginDataRepository: IUserLoginDataRepository,
    @Inject(OutboxRepository)
    private readonly outboxRepository: IOutboxRepository,
  ) {}
  getOutboxRepository(): IOutboxRepository {
    return this.outboxRepository;
  }

  getUserAccountRepository(): IUserAccountRepository {
    return this.userAccountRepository;
  }
  getUserLoginDataRepository(): IUserLoginDataRepository {
    return this.userLoginDataRepository;
  }

  private getDataSource(): DataSource {
    return this.dataSource;
  }

  async doTransactional<W>(work: () => W | Promise<W>): Promise<W> {
    const queryRunner = this.getDataSource().createQueryRunner("master");
    return await this._asyncLocalStorage.run(new Map<string, EntityManager>(), async () => {
      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        this._asyncLocalStorage.getStore().set("typeOrmEntityManager", queryRunner.manager);
        const result: W = await work();
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    });
  }

  getTransactionManager(): unknown {
    const storage = this._asyncLocalStorage.getStore();
    if (storage && storage.has("typeOrmEntityManager")) {
      return storage.get("typeOrmEntityManager");
    }
    return null;
  }
}
