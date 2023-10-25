import { Module } from '@nestjs/common';
import { USER_DATABASE_PROVIDER } from './providers/user.provider';
import { UserMongoService } from './mongo/user-mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from './mongo/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: 'configService.get()',
        };
      },
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: USER_DATABASE_PROVIDER,
      useClass: UserMongoService,
    },
  ],
  exports: [USER_DATABASE_PROVIDER],
})
export class DatabaseModule {}
