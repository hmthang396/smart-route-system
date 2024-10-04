export class ExternalProvider {
  constructor(data?: Partial<ExternalProvider>) {
    Object.assign(this, { ...data });
  }

  externalProviderId: number;
  uuid: string;
  providerName: string;
  wsEndPoint: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
