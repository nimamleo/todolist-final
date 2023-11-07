import { IDated } from 'src/common/interface/dated.interface';
import { IEntity } from 'src/common/interface/entity.interface';
import { ITodolistEntity } from './todolist.model';

export interface IUser {
    username: string;
    password: string;
    todoLists: Partial<ITodolistEntity>[];
}

export interface IUserEntity extends IUser, IEntity, IDated {}
