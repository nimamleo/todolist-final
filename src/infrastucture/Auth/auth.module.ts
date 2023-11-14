import { Inject, Module } from '@nestjs/common';
import { AuthJwtService } from './JWT/auth-jwt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_JWT_PROVIDER } from './provider/auth.provider';
import { JwtStrategy } from './JWT/strategies/jwt.strategy';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secretOrPrivateKey: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: 3600,
                },
            }),
        }),
        DatabaseModule,
    ],
    providers: [
        {
            provide: AUTH_JWT_PROVIDER,
            useClass: AuthJwtService,
        },

        JwtService,
        ConfigService,
        JwtStrategy,
    ],
    exports: [AUTH_JWT_PROVIDER],
})
export class AuthModule {}
