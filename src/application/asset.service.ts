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
import {
    IUserProvider,
    USER_DATABASE_PROVIDER,
} from '../infrastucture/database/provider/user.provider';
import { GenericErrorCode } from '../common/errors/generic-error';

@Injectable()
export class AssetService {
    constructor(
        @Inject(FILE_DISK_PROVIDER)
        private readonly fileService: IFileProvider,
        @Inject(ASSET_DATABASE_PROVIDER)
        private readonly fileRepository: IAssetProvider,
        @Inject(USER_DATABASE_PROVIDER)
        private readonly userepository: IUserProvider,
    ) {}

    @HandleError
    async createFile(
        file: Partial<IFile>,
        todoId: string,
    ): Promise<Result<Partial<IFileEntity>>> {
        const saveInDisk = await this.fileService.createFile(file);
        if (saveInDisk.isError()) {
            return Err('can not save file in storage');
        }

        const saveInDB = await this.fileRepository.createFile(
            {
                filePath: saveInDisk.value.filePath,
                fileName: saveInDisk.value.fileName,
                mimetype: file.mimetype,
                size: file.size,
            },
            todoId,
        );
        if (saveInDB.isError()) {
            await this.fileService.deleteFile(saveInDisk.value.filePath);
        }
        return Ok(saveInDB.value);
    }

    @HandleError
    async serveImage(imageId: string, userId: string) {
        const image = await this.fileRepository.getFile(imageId);
        const user = await this.userepository.getOneTodo(
            image.value.todoId,
            userId,
        );
        if (!user) return Err('user not found', GenericErrorCode.NOT_FOUND);
        const stream = await this.fileService.serveImage(image.value.filePath);
        if (!stream) return Err('stream failed');
        return Ok({
            stream: stream.value,
            size: image.value.size,
            mimetype: image.value.mimetype,
        });
    }
}
