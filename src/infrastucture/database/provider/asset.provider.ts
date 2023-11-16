import { IFile, IFileEntity } from '../../../model/file.model';
import { Result } from '../../../common/result';

export interface IAssetReader {}
export interface IAssetWriter {
    createFile(
        ifile: Partial<IFile>,
        todoId: string,
    ): Promise<Result<Partial<IFileEntity>>>;
    deleteFile(id: string): Promise<Result<boolean>>;
    getFile(id: string): Promise<Result<Partial<IFileEntity>>>;
}

export const ASSET_DATABASE_PROVIDER = 'asset-database-provider';

export interface IAssetProvider extends IAssetReader, IAssetWriter {}
