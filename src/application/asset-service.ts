import { Inject, Injectable } from '@nestjs/common';
import { ASSET_DATABASE_PROVIDER } from '../infrastucture/database/provider/asset.provider';
import {
    FILE_DISK_PROVIDER,
    IFileProvider,
} from '../infrastucture/storage/provider/file.provider';

@Injectable()
export class AssetService {
    constructor(
        @Inject(FILE_DISK_PROVIDER) fileService: IFileProvider,
        @Inject(ASSET_DATABASE_PROVIDER) fileRepository: IFileProvider,
    ) {}
}
