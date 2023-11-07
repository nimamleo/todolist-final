import { Module } from '@nestjs/common';
import { UserService } from 'src/application/user.service';
import { BcryptService } from 'src/infrastucture/bcrypt/bcrypt.service';
import { UserController } from './http/users/user.controller';
import { ApplicationModule } from 'src/application/application.module';

@Module({
    controllers: [UserController],
    imports:[ApplicationModule]
})
export class IoModule {}
