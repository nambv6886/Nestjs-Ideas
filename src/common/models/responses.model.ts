import { IdeaRO } from "../../modules/idea/models/idea.model";
import { UserRO } from "../../modules/user/models/user.model";
import { CommentEntity } from "src/modules/comment/models/comment.entity";
import { RoleEntity } from "src/modules/role/models/role.entity";
import { RoleType } from "../enum/roles.enum";

export class ResponseMessage {
  status: number;
  messageCode: number;
  message: string;
  messages: string[]

  constructor(fields?: Partial<ResponseMessage>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class LoginResponse extends ResponseMessage {
  accessToken: string;
  refreshToken: string;

  constructor(fields?: Partial<LoginResponse>) {
    super(fields);
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class UserReponse extends ResponseMessage {
  user: UserRO;
  users: UserRO[];
  constructor(fields?: Partial<UserReponse>) {
    super(fields);
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class IdeaResponse extends ResponseMessage {
  idea: IdeaRO;
  ideas: IdeaRO[];
  constructor(fields?: Partial<IdeaResponse>) {
    super(fields);
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class CommentResponseMessage extends ResponseMessage {
  comment: CommentEntity;
  comments: CommentEntity[];
  constructor(fields?: Partial<CommentResponseMessage>) {
    super(fields);
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class RefreshTokenRespose extends ResponseMessage {
  refreshToken: string;
  constructor(fields?: Partial<RefreshTokenRespose>) {
    super(fields);
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class RefreshTokenPayload {
  userId: number;
  key: string;
  constructor(fields?: Partial<RefreshTokenPayload>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class JwtPayload {
  userId: number;
  username: string;
  roles: RoleType[];

  constructor(fields?: Partial<JwtPayload>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}