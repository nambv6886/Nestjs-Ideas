import { Idea } from "../../idea/idea.entity";

export class UserRO {
  id: number;
  username: string;
  salt: string;
  createdAt: Date;
  ideas: Idea[];
  bookmarks: Idea[];
  upVoteIdeas: Idea[];
  downVoteIdeas: Idea[];
  token: string;

  constructor(fields: Partial<UserRO>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}