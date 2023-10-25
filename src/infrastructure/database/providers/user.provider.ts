import { IUser, IUserEntity } from '../../../model/user.model';

export interface IUserReader {
  getUserById(id: string): Promise<IUserEntity>;
}

export interface IUserWriter {
  createUser(iUser: IUser): Promise<IUserEntity>;
  updateUser(id: string, iUser: IUser): Promise<IUserEntity>;
}

export interface IUserProvider extends IUserReader, IUserWriter {}

export const USER_DATABASE_PROVIDER = 'user-database-provider';
