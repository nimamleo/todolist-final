import { Module } from '@nestjs/common';
import { USER_DATABASE_PROVIDER } from './provider/user.provider';
import { UserMongoService } from './mongo/user.mongo.service';
import { AssetMongoService } from './mongo/asset-mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from './mongo/schema/user.schema';
import { TodoList, TodoListSchema } from './mongo/schema/todolist.schema';
import { File, FileSchema } from './mongo/schema/file.schema';
import { ASSET_DATABASE_PROVIDER } from './provider/asset.provider';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: File.name, schema: FileSchema },
        ]),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get('MONGO_DB_URL'),
            }),
        }),
    ],
    providers: [
        { provide: USER_DATABASE_PROVIDER, useClass: UserMongoService },
        { provide: ASSET_DATABASE_PROVIDER, useClass: AssetMongoService },
    ],
    exports: [USER_DATABASE_PROVIDER, ASSET_DATABASE_PROVIDER],
})
export class DatabaseModule {}
