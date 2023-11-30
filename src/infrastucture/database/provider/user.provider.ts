import { FilterQuery } from 'mongoose';
import { ITodo, ITodoEntity } from 'src/model/todo.model';
import { ITodolist, ITodolistEntity } from 'src/model/todolist.model';
import { IUser, IUserEntity } from 'src/model/user.model';
import { Result } from '../../../common/result';

export interface IUserReader {
    getUserById(id: string): Promise<Result<IUserEntity>>;
    getUser(query: FilterQuery<unknown>): Promise<Result<IUserEntity>>;
    getOneTodoListById(
        id: string,
        userId: string,
    ): Promise<Result<ITodolistEntity>>;
    getOneTodoList(
        query: FilterQuery<unknown>,
        userId: string,
    ): Promise<Result<ITodolistEntity>>;
    getAllTodolist(userId: string): Promise<Result<ITodolistEntity[]>>;
    getOneTodo(todoId: string, userId: string): Promise<Result<ITodoEntity>>;
    getAllTodo(
        userId: string,
        todolistId: string,
        page: number,
        perPage: number,
    ): Promise<Result<ITodoEntity[]>>;
}
export interface IUserWriter {
    createUser(iUser: Partial<IUser>): Promise<Result<IUserEntity>>;
    deleteUserById(id: string): Promise<Result<boolean>>;
    updateUserRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<Result<boolean>>;
    createTodolist(
        iTodolist: Partial<ITodolist>,
        userId: string,
    ): Promise<Result<ITodolistEntity>>;
    deleteTodolist(id: string, userId: string): Promise<Result<boolean>>;
    createTodo(
        iTodo: Partial<ITodo>,
        userId: string,
        todolistId: string,
    ): Promise<Result<ITodoEntity>>;
    updateTodo(
        todoId: string,
        todolistId: string,
        ITodo: Partial<ITodo>,
        userId: string,
    ): Promise<Result<ITodoEntity>>;
    deleteTodo(todoId: string, userId: string): Promise<Result<boolean>>;
}
export interface IUserProvider extends IUserReader, IUserWriter {}

export const USER_DATABASE_PROVIDER = 'user-databse-provider';
