import { Module } from '@nestjs/common';
import { UserController } from './http/user.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [UserController],
})
export class IoModule {}
