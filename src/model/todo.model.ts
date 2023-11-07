import { IDated } from 'src/common/interface/dated.interface';
import { IEntity } from 'src/common/interface/entity.interface';

export interface ITodo {
    title: string;
    description: string;
}

export interface ITodoEntity extends ITodo, IEntity, IDated {}
