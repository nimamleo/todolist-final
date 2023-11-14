import { Result } from '../../../common/result';
import { IUserEntity } from '../../../model/user.model';

export interface IAuthProvider {
    signInToken(username: string, type: string): Promise<Result<string>>;

    verifyToken(username: string, password: string): Promise<Result<boolean>>;
}

export const AUTH_JWT_PROVIDER = 'auth-jwt-provider';
