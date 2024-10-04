import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { TimestampEntity } from "./timestamp.entity";
import { Role } from "@app/common";
import { UserAccountEntity } from "./user-account.entity";
import { PermissionEntity } from "./permission.entity";

@Entity({ name: "roles" })
export class RoleEntity extends TimestampEntity implements Role {
  // Constructor
  constructor(userRoleEntity?: Partial<RoleEntity>) {
    super();
    Object.assign(this, userRoleEntity);
  }

  @PrimaryGeneratedColumn({ name: "role_id", type: "bigint" })
  roleId: number;

  @Column({ name: "uuid", type: "uuid", generated: "uuid" })
  uuid: string;

  @Column({
    name: "description",
    type: "varchar",
    length: 20,
    nullable: true,
    default: "",
  })
  roleName: string;

  // Many-to-many relation with UserAccount
  @ManyToMany(() => UserAccountEntity, (user) => user.roles)
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "role_id", referencedColumnName: "roleId" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "userId" },
  })
  users: UserAccountEntity[];

  // Many-to-many relation with Permission
  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable({
    name: "role_permissions", // Join table name
    joinColumn: { name: "role_id", referencedColumnName: "roleId" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "permissionId" },
  })
  permissions: PermissionEntity[];
}
