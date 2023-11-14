import { IFile } from '../../../model/file.model';
import { Result } from '../../../common/result';

export interface IFileProvider {
    createFile(ifile: Partial<IFile>): Promise<Result<IFile>>;
    deleteFile(filePath: string): Promise<Result<boolean>>;
}
export const FILE_DISK_PROVIDER = 'file-disk-provider';
