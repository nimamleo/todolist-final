import { IEntity } from '../common/interfaces/entity.interface';
import { IDated } from '../common/interfaces/dated.interface';
import { ITodoEntity } from './todo.model';

export interface IUser {
  username: string;
  password: string;
  todos: Partial<ITodoEntity>[];
}

export interface IUserEntity extends IUser, IEntity, IDated {}
