import Idea from "../../idea/idea.entity";

export class UserModel {
  id: number;
  username: string;
  password: string;
  salt: string;
  createdAt: Date;
  ideas: Idea[]

  constructor(fields: Partial<UserModel>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}