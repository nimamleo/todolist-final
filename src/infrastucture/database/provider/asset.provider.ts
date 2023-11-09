import { IFile, IFileEntity } from '../../../model/file.model';

export interface IAssetReader {}
export interface IAssetWriter {
    createFile(ifile: Partial<IFile>): Promise<Partial<IFileEntity>>;
}

export const ASSET_DATABASE_PROVIDER = 'asset-database-provider';

export interface IFileProvider extends IAssetReader, IAssetWriter {}
