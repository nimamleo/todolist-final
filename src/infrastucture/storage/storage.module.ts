import { Module } from '@nestjs/common';
import { DiskService } from './disk/disk.service';
import { FILE_DISK_PROVIDER } from './provider/file.provider';

@Module({
    imports: [],
    providers: [{ provide: FILE_DISK_PROVIDER, useClass: DiskService }],
    exports: [FILE_DISK_PROVIDER],
})
export class StorageModule {}
