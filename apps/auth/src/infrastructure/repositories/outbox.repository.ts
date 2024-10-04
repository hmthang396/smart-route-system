import { Inject, Injectable } from "@nestjs/common";
import { AbstractRepository, DataSource, LessThan, Repository } from "typeorm";
import { OutboxEntity } from "../entities";
import { IOutboxRepository } from "@app/auth/domain/repositories";
import { AsyncLocalStorage } from "async_hooks";
import { MAX_RETRY_COUNT, Outbox, OutboxStatus } from "@app/common";

@Injectable()
export class OutboxRepository extends AbstractRepository<OutboxEntity> implements IOutboxRepository {
  constructor(
    @Inject("LocalStorage")
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async createOutbox(outbox: Partial<Outbox>): Promise<Outbox> {
    const entity = await this.outboxEntityRepository.save(new OutboxEntity({ ...outbox }));

    return entity.toModel();
  }

  async findByUUID(uuid: string): Promise<Outbox> {
    const entity = await this.outboxEntityRepository.findOne({
      where: {
        uuid,
      },
    });

    return entity.toModel();
  }

  async findPendingMessages(): Promise<Outbox[]> {
    const entity = await this.outboxEntityRepository.find({
      where: {
        status: OutboxStatus.PENDING,
        retryCount: LessThan(MAX_RETRY_COUNT),
      },
    });

    return entity.map((e) => e.toModel());
  }

  async markAsSent(uuid: string): Promise<void> {
    await this.outboxEntityRepository.update(
      {
        uuid,
        status: OutboxStatus.PENDING,
      },
      {
        status: OutboxStatus.SENT,
        sentAt: new Date(),
      },
    );
  }

  async markAsFailed(uuid: string): Promise<void> {
    const entity = await this.findByUUID(uuid);

    if (entity) {
      entity.retryCount++;

      if (entity.retryCount === 3) {
        entity.status = OutboxStatus.PENDING;
      }

      await this.outboxEntityRepository.save(entity);
    }
  }

  get outboxEntityRepository(): Repository<OutboxEntity> {
    const storage = this.localStorage.getStore();
    if (storage && storage.has("typeOrmEntityManager")) {
      return storage.get("typeOrmEntityManager").getRepository(OutboxEntity);
    }
    return this.dataSource.getRepository(OutboxEntity);
  }
}
