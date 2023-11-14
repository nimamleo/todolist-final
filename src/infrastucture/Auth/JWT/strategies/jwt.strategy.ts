import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
    IUserProvider,
    USER_DATABASE_PROVIDER,
} from '../../../database/provider/user.provider';
import { IUserPayload } from '../../../../common/interface/userPayload.interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ConfigService,
        @Inject(USER_DATABASE_PROVIDER)
        private readonly userRepository: IUserProvider,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: IUserPayload) {
        const user = await this.userRepository.getUser({
            username: payload.username,
        });
        if (!user) throw new NotFoundException('please login');

        return user;
    }
}
