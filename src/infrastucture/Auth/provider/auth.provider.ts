import { Result } from '../../../common/result';
import { IUserEntity } from '../../../model/user.model';
import { TokensInterface } from '../../../common/interface/tokens.interface';

export interface IAuthProvider {
    signTokens(
        userId: string,
        username: string,
        type: string,
    ): Promise<Result<TokensInterface>>;

    verifyToken(refreshToken: string): Promise<Result<string>>;
}

export const AUTH_JWT_PROVIDER = 'auth-jwt-provider';
