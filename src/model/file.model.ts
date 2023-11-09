import { IDated } from '../common/interface/dated.interface';
import { IEntity } from '../common/interface/entity.interface';

export interface IFile {
    size: number;
    filePath: string;
    fileName: string;
    mimetype: string;
    buffer: Buffer;
    todoId?: string;
}

export interface IFileEntity extends IFile, IDated, IEntity {}
