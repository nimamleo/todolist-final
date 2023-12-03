import { IDated } from 'src/common/interface/dated.interface';
import { IEntity } from 'src/common/interface/entity.interface';
import { IFile } from './file.model';

export interface ITodo {
    title: string;
    description: string;
    imageId: string;
}

export interface ITodoEntity extends ITodo, IEntity, IDated {}
