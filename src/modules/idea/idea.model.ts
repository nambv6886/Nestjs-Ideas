import { UserRO } from "../user/models/user.model";
import { UserEntity } from "../user/user.entity";

export class IdeaRO {
  id: number;
  idea: string;
  descripion: string;
  createdAt: Date;
  authorId: number;
  author: UserRO
  bookmarkers: UserEntity[];
  downvotes: number;
  upvotes: number;

  constructor(fields: Partial<IdeaRO>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}