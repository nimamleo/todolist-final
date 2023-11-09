import { Module } from '@nestjs/common';
import { UserController } from './http/users/user.controller';
import { ApplicationModule } from 'src/application/application.module';
import { FileUploadController } from './http/users/fileUpload.controller';

@Module({
    controllers: [UserController, FileUploadController],
    imports: [ApplicationModule],
})
export class IoModule {}
