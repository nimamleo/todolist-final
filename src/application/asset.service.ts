import { Inject, Injectable } from '@nestjs/common';
import {
    FILE_DISK_PROVIDER,
    IFileProvider,
} from '../infrastucture/storage/provider/file.provider';
import {
    ASSET_DATABASE_PROVIDER,
    IAssetProvider,
} from '../infrastucture/database/provider/asset.provider';
import { IFile, IFileEntity } from '../model/file.model';
import { Err, Ok, Result } from '../common/result';
import { HandleError } from '../common/decorator/handler-error.decorator';

@Injectable()
export class AssetService {
    constructor(
        @Inject(FILE_DISK_PROVIDER) private readonly fileService: IFileProvider,
        @Inject(ASSET_DATABASE_PROVIDER)
        private readonly fileRepository: IAssetProvider,
    ) {}

    @HandleError
    async createFile(
        file: Partial<IFile>,
    ): Promise<Result<Partial<IFileEntity>>> {
        const saveInDisk = await this.fileService.createFile(file);
        if (saveInDisk.isError()) {
            return Err('can not save file in storage');
        }

        const saveInDB = await this.fileRepository.createFile({
            buffer: file.buffer,
            fileName: saveInDisk.value.fileName,
            size: file.size,
            filePath: saveInDisk.value.filePath,
            todoId: '654d8092cd42bbc147f53eee',
            mimetype: file.mimetype,
        });
        if (saveInDB.isError()) {
            await this.fileService.deleteFile(saveInDisk.value.filePath);
        }
        return Ok(saveInDB.value);
    }
}
