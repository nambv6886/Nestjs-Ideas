export class RefreshTokenModel {
  id: number;
  key: string;
  refreshToken: string;
  userId: number;

  constructor(fields?: Partial<RefreshTokenModel>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}