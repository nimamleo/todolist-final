import { IFile } from '../../../model/file.model';

export interface IFileProvider {
    createFile(ifile: IFile): Promise<IFile>;
}
export const FILE_DISK_PROVIDER = 'file-disk-provider';
