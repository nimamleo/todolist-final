import { IEntity } from 'src/common/interface/entity.interface';
import { IUserEntity } from './user.model';
import { IDated } from 'src/common/interface/dated.interface';
import { ITodoEntity } from './todo.model';
import { User } from '../infrastucture/database/mongo/schema/user.schema';

export interface ITodolist {
    listTitle: string;
    todos: Partial<ITodoEntity>[];
}

export interface ITodolistEntity extends ITodolist, IEntity, IDated {}
