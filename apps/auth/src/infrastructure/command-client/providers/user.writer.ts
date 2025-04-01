import { UpdateRefreshTokenRequest } from '../models/user/update-refresh-token.model';

export interface IUserWriter {
  updateRefreshToken(req: UpdateRefreshTokenRequest): Promise<void>;
}

export const USER_WRITER = 'user-writer';
