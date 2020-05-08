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

  constructor(fields?: Partial<LoginResponse>) {
    super(fields);
    if (fields) {
      Object.assign(this, fields);
    }
  }
}

export class JwtPayload {
  userId: number;
  username: string;

  constructor(fields?: Partial<JwtPayload>) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}