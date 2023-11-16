import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/infrastucture/database/database.module';
import { AssetService } from './asset.service';
import { StorageModule } from '../infrastucture/storage/storage.module';
import { AuthModule } from '../infrastucture/Auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [DatabaseModule, StorageModule, AuthModule],
    providers: [UserService, AssetService],
    exports: [UserService, AssetService],
})
export class ApplicationModule {}
