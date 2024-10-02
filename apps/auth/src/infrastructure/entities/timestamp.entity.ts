import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

export abstract class TimestampEntity {
  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    precision: null,
    default: () => "CURRENT_TIMESTAMP",
    update: false,
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    precision: null,
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: "deleted_at",
    type: "timestamp",
    default: null,
    nullable: true,
  })
  deletedAt: Date;
}
