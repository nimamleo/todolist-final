import { ConfigFactory, registerAs } from '@nestjs/config';

export interface IHttpConfig {
    port: number;
}

export const httpConfigToken = 'HTTP-CONFIG-TOKEN';

export const httpConfigLoader = registerAs<
    IHttpConfig,
    ConfigFactory<IHttpConfig>
>(httpConfigToken, () => {
    if (!process.env.HTTP_PORT || isNaN(Number(process.env.HTTP_PORT))) {
        throw new Error('HTTP_PORT is not provided');
    }

    return {
        port: Number(process.env.HTTP_PORT),
    };
});
