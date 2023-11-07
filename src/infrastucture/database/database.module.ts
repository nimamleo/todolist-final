import { Module } from "@nestjs/common";
import { USER_DATABASE_PROVIDER } from "./provider/user.provider";
import { UserMongoService } from "./mongo/user.mongo.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User, UserSchema } from "./mongo/schema/user.schema";
import { TodoList, TodoListSchema } from "./mongo/schema/todolist.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TodoList.name, schema: TodoListSchema }
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("MONGO_DB_URL")
      })
    })
  ],
  providers: [
    { provide: USER_DATABASE_PROVIDER, useClass: UserMongoService }
  ],
  exports: [USER_DATABASE_PROVIDER]
})
export class DatabaseModule {
}
