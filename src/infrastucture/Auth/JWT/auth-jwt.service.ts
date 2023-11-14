import { Injectable } from '@nestjs/common';
import { IAuthProvider } from '../provider/auth.provider';
import { Ok, Result } from '../../../common/result';
import { IUserEntity } from '../../../model/user.model';
import { JwtService } from '@nestjs/jwt';
import { HandleError } from '../../../common/decorator/handler-error.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthJwtService implements IAuthProvider {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    @HandleError
    async signInToken(
        // userId: string,
        username: string,
        type: string,
    ): Promise<Result<string>> {
        const token = this.jwtService.sign(
            {
                sub: '123',
                username,
                type,
            },
            { secret: this.configService.get('JWT_SECRET') },
        );
        console.log(token);
        return Ok(token);
    }

    @HandleError
    async verifyToken(
        username: string,
        password: string,
    ): Promise<Result<boolean>> {
        return Ok(true);
    }
}
