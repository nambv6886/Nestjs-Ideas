export class RefreshTokenDto {
  refreshToken: string;

  constructor(fields?: Partial<RefreshTokenDto>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}