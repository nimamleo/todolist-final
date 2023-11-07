import { Module } from '@nestjs/common';
import { IoModule } from './io/io.module';
import { ConfigModule } from '@nestjs/config';
import { httpConfigLoader } from './io/http/config/http.config';
import { ApplicationModule } from './application/application.module';
import { mongoConfigLoader } from './infrastucture/database/mongo/mongo-db.config';
import { DatabaseModule } from './infrastucture/database/database.module';

@Module({
    imports: [
        ApplicationModule,
        IoModule,
        DatabaseModule,
        ConfigModule.forRoot({
            cache: true,
            load: [httpConfigLoader, mongoConfigLoader],
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
        }),
    ],
})
export class AppModule {}
