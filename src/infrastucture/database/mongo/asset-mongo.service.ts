import { Injectable } from '@nestjs/common';
import { File } from './schema/file.schema';
import { IFile, IFileEntity } from '../../../model/file.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IFileProvider } from '../provider/asset.provider';

@Injectable()
export class AssetMongoService implements IFileProvider {
    constructor(
        @InjectModel(File.name)
        private readonly fileModel: Model<File>,
    ) {}
    async createFile(ifile: IFile): Promise<Partial<IFileEntity>> {
        const file = File.fromIFile(ifile);
        const res = await this.fileModel.create(file);
        return File.toIFileEntity(res);
    }
}
