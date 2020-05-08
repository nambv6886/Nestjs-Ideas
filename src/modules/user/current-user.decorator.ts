import { createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator(async (data, request) => {
  return request.user;
})