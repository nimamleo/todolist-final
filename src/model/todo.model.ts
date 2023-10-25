import { IEntity } from '../common/interfaces/entity.interface';
import { IDated } from '../common/interfaces/dated.interface';
import { IUserEntity } from './user.model';
import { ITodoItemEntity } from './todo-item.model';

export interface ITodo {
  title: string;
  user: Partial<IUserEntity>;
  items: Partial<ITodoItemEntity>[];
}

export interface ITodoEntity extends ITodo, IEntity, IDated {}
