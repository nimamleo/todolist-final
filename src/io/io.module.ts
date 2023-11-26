import { Module } from '@nestjs/common';
import { UserController } from './http/users/user.controller';
import { ApplicationModule } from 'src/application/application.module';
import { AssetController } from './http/asserst/asset.controller';

@Module({
    controllers: [UserController, AssetController],
    imports: [ApplicationModule],
})
export class IoModule {}
