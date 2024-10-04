export class Role {
  constructor(data?: Partial<Role>) {
    Object.assign(this, { ...data });
  }

  roleId: number;
  uuid: string;
  roleName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
