import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { TimestampEntity } from "./timestamp.entity";
import { Permission } from "@app/common";
import { RoleEntity } from "./role.entity";

@Entity({ name: "permissions" })
export class PermissionEntity extends TimestampEntity implements Permission {
  // Constructor
  constructor(permissionEntity?: Partial<PermissionEntity>) {
    super();
    Object.assign(this, permissionEntity);
  }

  @PrimaryGeneratedColumn({ name: "permission_id", type: "bigint" })
  permissionId: number;

  @Column({ name: "uuid", type: "uuid", generated: "uuid" })
  uuid: string;

  @Column({
    name: "description",
    type: "varchar",
    length: 50,
    nullable: true,
    default: "",
  })
  permissionName: string;

  //
  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}
