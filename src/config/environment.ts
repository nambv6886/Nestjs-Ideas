import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = +(process.env.PORT);

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const REFRESH_TOKEN_JWT_KEY = process.env.REFRESH_TOKEN_JWT_KEY;

export const REFRESH_TOKEN_JWT_EXPIRES = process.env.REFRESH_TOKEN_JWT_EXPIRES;