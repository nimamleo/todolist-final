import { Injectable } from '@nestjs/common';
import { File } from './schema/file.schema';
import { IFile, IFileEntity } from '../../../model/file.model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IAssetProvider } from '../provider/asset.provider';
import { Err, Ok, Result } from '../../../common/result';
import { GenericErrorCode } from '../../../common/errors/generic-error';

@Injectable()
export class AssetMongoService implements IAssetProvider {
    constructor(
        @InjectModel(File.name)
        private readonly fileModel: Model<File>,
    ) {}

    async createFile(
        ifile: Partial<IFile>,
        todoId: string,
    ): Promise<Result<Partial<IFileEntity>>> {
        const file = File.fromIFile(ifile);

        const res = await this.fileModel.create({
            filePath: file.filePath,
            fileName: file.fileName,
            mimetype: file.mimetype,
            size: file.size,
            todoId: todoId,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
        });
        if (!res) {
            return Err('create failed');
        }
        return Ok(File.toIFileEntity(res));
    }
    async deleteFile(id: string): Promise<Result<boolean>> {
        const res = await this.fileModel.deleteOne({
            _id: new Types.ObjectId(id),
        });
        if (res.deletedCount == 0) {
            return Err('delete failed');
        }
        return Ok(res.deletedCount >= 1);
    }

    async getFile(id: string): Promise<Result<Partial<IFileEntity>>> {
        const res = await this.fileModel.findOne({
            _id: new Types.ObjectId(id),
        });
        if (!res) return Err('image not found', GenericErrorCode.NOT_FOUND);
        return Ok({
            filePath: res.filePath,
            fileName: res.fileName,
            mimetype: res.mimetype,
            size: res.size,
            todoId: res.todoId.toString(),
        });
    }
}
