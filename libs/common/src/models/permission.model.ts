export class Permission {
  constructor(data?: Partial<Permission>) {
    Object.assign(this, { ...data });
  }

  permissionId: number;
  uuid: string;
  permissionName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
