import { Module } from '@nestjs/common';
import { DiskService } from './disk/disk.service';
import { FILE_DISK_PROVIDER } from './provider/file.provider';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [],
    providers: [
        { provide: FILE_DISK_PROVIDER, useClass: DiskService },
        ConfigService,
    ],
    exports: [FILE_DISK_PROVIDER],
})
export class StorageModule {}
