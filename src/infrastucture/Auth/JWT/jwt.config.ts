import { ConfigFactory, registerAs } from '@nestjs/config';

export interface IJwtConfig {
    secret: string;
}

export const JWT_CONFIG_TOKEN = 'JWT_SECRET';

export const jwtConfigLoader = registerAs<
    IJwtConfig,
    ConfigFactory<IJwtConfig>
>(JWT_CONFIG_TOKEN, () => {
    if (!process.env.JWT_CONFIG_TOKEN) {
        throw new Error('JWT_CONFIG_TOKEN not provided.');
    }

    return {
        secret: process.env.JWT_CONFIG_TOKEN,
    };
});
