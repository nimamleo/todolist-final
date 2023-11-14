import { Injectable } from '@nestjs/common';
import { File } from './schema/file.schema';
import { IFile, IFileEntity } from '../../../model/file.model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IAssetProvider } from '../provider/asset.provider';
import { Err, Ok, Result } from '../../../common/result';

@Injectable()
export class AssetMongoService implements IAssetProvider {
    constructor(
        @InjectModel(File.name)
        private readonly fileModel: Model<File>,
    ) {}

    async createFile(ifile: IFile): Promise<Result<Partial<IFileEntity>>> {
        const file = File.fromIFile(ifile);
        const res = await this.fileModel.create(file);
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
}
