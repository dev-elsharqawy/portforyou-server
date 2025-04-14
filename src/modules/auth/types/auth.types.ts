import { IUser } from '../../../models/User';

export interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  token: string;
  user: IUser;
}

export interface AuthError extends Error {
  statusCode?: number;
}

export interface AuthenticatedContext {
  user: IUser;
  token: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  username: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
