export class UserModel {
  id: number;
  username: string;
  password: string;
  salt: string;
  createdAt: Date;

  constructor(fields: Partial<UserModel>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}