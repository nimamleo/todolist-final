import { IDated } from 'src/common/interface/dated.interface';
import { IEntity } from 'src/common/interface/entity.interface';
import { ITodolistEntity } from './todolist.model';
import { Role } from '../common/enum/role.enum';

export interface IUser {
    username: string;
    password: string;
    role: Role;
    todoLists: Partial<ITodolistEntity>[];
}

export interface IUserEntity extends IUser, IEntity, IDated {}
export interface INewUserEntity extends IUser, IEntity, IDated {
    token: string;
}
