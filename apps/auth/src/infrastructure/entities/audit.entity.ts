import { Column } from "typeorm";

export abstract class AuditEntity {
  @Column({
    name: "created_by",
    type: "int",
    nullable: false,
  })
  createdBy: number;

  @Column({
    name: "updated_by",
    type: "int",
    nullable: false,
  })
  updatedBy: number;

  @Column({
    name: "deleted_by",
    type: "int",
    nullable: true,
  })
  deletedBy: number;
}
