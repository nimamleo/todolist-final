import { IDated } from '../common/interfaces/dated.interface';
import { IEntity } from '../common/interfaces/entity.interface';
import { ITodoEntity } from './todo.model';

export interface ITodoItem {
  title: string;
  note: string;
  priority: number;
  todo: Partial<ITodoEntity>;
}

export interface ITodoItemEntity extends ITodoItem, IDated, IEntity {}
