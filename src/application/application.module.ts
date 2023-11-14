import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/infrastucture/database/database.module';
import { AssetService } from './asset.service';
import { AssetMongoService } from '../infrastucture/database/mongo/asset-mongo.service';
import { StorageModule } from '../infrastucture/storage/storage.module';
import { AuthJwtService } from '../infrastucture/Auth/JWT/auth-jwt.service';
import { AuthModule } from '../infrastucture/Auth/auth.module';

@Module({
    imports: [DatabaseModule, StorageModule, AuthModule],
    providers: [UserService, AssetService],
    exports: [UserService, AssetService],
})
export class ApplicationModule {}
