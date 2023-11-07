import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { DatabaseModule } from "src/infrastucture/database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [UserService],
  exports: [UserService]
})
export class ApplicationModule {
}
