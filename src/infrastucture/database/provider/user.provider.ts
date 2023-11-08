import { FilterQuery } from 'mongoose';
import { ITodo, ITodoEntity } from 'src/model/todo.model';
import { ITodolist, ITodolistEntity } from 'src/model/todolist.model';
import { IUser, IUserEntity } from 'src/model/user.model';

export interface IUserReader {
    getUserById(id: string): Promise<IUserEntity>;
    getUser(query: FilterQuery<unknown>): Promise<IUserEntity>;
    getOneTodoListById(id: string, userId: string): Promise<ITodolistEntity>;
    getOneTodoList(
        query: FilterQuery<unknown>,
        userId: string,
    ): Promise<ITodolistEntity>;
    getAllTodolist(userId: string): Promise<ITodolistEntity[]>;
    getOneTodo(todoId: string, userId: string): Promise<ITodoEntity>;
    getAllTodo(userId: string, todolistId: string): Promise<ITodoEntity[]>;
}
export interface IUserWriter {
    createUser(iUser: Partial<IUser>): Promise<IUserEntity>;
    deleteUserById(id: string): Promise<boolean>;
    createTodolist(
        iTodolist: Partial<ITodolist>,
        userId: string,
    ): Promise<ITodolistEntity>;
    deleteTodolist(id: string, userId: string): Promise<boolean>;
    createTodo(
        iTodo: Partial<ITodo>,
        userId: string,
        todolistId: string,
    ): Promise<ITodoEntity>;
    updateTodo(
        todoId: string,
        todolistId: string,
        ITodo: Partial<ITodo>,
        userId: string,
    ): Promise<ITodoEntity>;
    deleteTodo(todoId: string, userId: string): Promise<boolean>;
}
export interface IUserProvider extends IUserReader, IUserWriter {}

export const USER_DATABASE_PROVIDER = 'user-databse-provider';
