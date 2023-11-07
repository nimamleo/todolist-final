import { ConfigFactory, registerAs } from '@nestjs/config';

export interface IMongoDbConfig {
    connectionString: string;
}

export const MONGODB_CONFIG_TOKEN = 'mongodb-config-token';

export const mongoConfigLoader = registerAs<
    IMongoDbConfig,
    ConfigFactory<IMongoDbConfig>
>(MONGODB_CONFIG_TOKEN, () => {
    
    if (!process.env.MONGO_DB_URL) {
        throw new Error('MONGO_DB_URL not provided.');
    }

    return {
        connectionString: process.env.MONGO_DB_URL,
    };
});
