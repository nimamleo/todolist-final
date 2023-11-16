import { Injectable } from '@nestjs/common';
import { IAuthProvider } from '../provider/auth.provider';
import { Err, Ok, Result } from '../../../common/result';
import { JwtService } from '@nestjs/jwt';
import { HandleError } from '../../../common/decorator/handler-error.decorator';
import { ConfigService } from '@nestjs/config';
import { TokensInterface } from '../../../common/interface/tokens.interface';
import { GenericErrorCode } from '../../../common/errors/generic-error';

@Injectable()
export class AuthJwtService implements IAuthProvider {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    @HandleError
    async signTokens(
        userId: string,
        username: string,
        type: string,
    ): Promise<Result<TokensInterface>> {
        const accessToken = this.jwtService.sign(
            {
                sub: userId,
                username,
                type,
            },
            { expiresIn: '15m', secret: this.configService.get('JWT_SECRET') },
        );
        const refreshToken = this.jwtService.sign(
            {
                sub: userId,
                username,
                type,
            },
            { expiresIn: '7d', secret: this.configService.get('JWT_SECRET') },
        );
        return Ok({ accessToken, refreshToken });
    }

    @HandleError
    async verifyToken(refreshToken: string): Promise<Result<string>> {
        const userId = await this.jwtService.verify(refreshToken, {
            secret: this.configService.get('JWT_SECRET'),
        });

        return Ok(userId.sub);
    }
}
