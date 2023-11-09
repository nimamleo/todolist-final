import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/infrastucture/database/database.module';
import { AssetService } from './asset-service';
import { AssetMongoService } from '../infrastucture/database/mongo/asset-mongo.service';
import { StorageModule } from '../infrastucture/storage/storage.module';

@Module({
    imports: [DatabaseModule, StorageModule],
    providers: [UserService, AssetService, AssetMongoService],
    exports: [UserService, AssetService, AssetMongoService],
})
export class ApplicationModule {}
