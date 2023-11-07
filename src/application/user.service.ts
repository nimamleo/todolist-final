import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { HandleError } from 'src/common/decorator/handler-error.decorator';
import { GenericErrorCode } from 'src/common/errors/generic-error';
import { Err, Ok, Result } from 'src/common/result';
import {
    IUserProvider,
    USER_DATABASE_PROVIDER,
} from 'src/infrastucture/database/provider/user.provider';
import { ITodo, ITodoEntity } from 'src/model/todo.model';
import { ITodolist, ITodolistEntity } from 'src/model/todolist.model';
import { IUser, IUserEntity } from 'src/model/user.model';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_DATABASE_PROVIDER)
        private readonly userRepository: IUserProvider,
    ) {}

    @HandleError
    async getUserById(id: string): Promise<Result<IUserEntity>> {
        const res = await this.userRepository.getUserById(id);
        if (!res) {
            return Err('user not found');
        }
        return Ok(res);
    }

    async createUser(userBody: Partial<IUser>): Promise<Result<IUserEntity>> {
        const res = await this.userRepository.createUser(userBody);
        if (!res) {
            return Err('create user failed');
        }
        return Ok(res);
    }

    async getUser(query: FilterQuery<unknown>) {
        const res = await this.userRepository.getUser(query);
    }
    async deleteUserById(id: string): Promise<Result<boolean>> {
        const res = await this.userRepository.deleteUserById(id);
        if (!res) {
            return Err('can not delete user with given id');
        }
        return Ok(res);
    }
    async createTodolist(
        todolistBody: Partial<ITodolist>,
        userId: string,
    ): Promise<Result<ITodolistEntity>> {
        const res = await this.userRepository.createTodolist(
            todolistBody,
            userId,
        );
        if (!res) {
            return Err('create todolist failed');
        }
        return Ok(res);
    }

    async getAllTodolist(userId: string): Promise<Result<ITodolistEntity[]>> {
        const res = await this.userRepository.getAllTodolist(userId);
        if (!res) {
            return Err('create todolist failed');
        }
        return Ok(res);
    }

    async getOneTodoListById(
        userId: string,
        todolistId: string,
    ): Promise<Result<ITodolistEntity>> {
        const res = await this.userRepository.getOneTodoListById(
            userId,
            todolistId,
        );
        if (!res) return Err('todolist not found', GenericErrorCode.NOT_FOUND);
        return Ok(res);
    }

    async getOneTodoList(userId: string, query: FilterQuery<unknown>) {
        const res = await this.userRepository.getOneTodoList(query, userId);
    }

    async deleteTodolist(
        userId: string,
        todolistId: string,
    ): Promise<Result<boolean>> {
        const res = await this.userRepository.deleteTodolist(
            userId,
            todolistId,
        );
        if (!res) {
            return Err('delete todolist failed');
        }
        return Ok(res);
    }

    async createTodo(
        todoBody: Partial<ITodo>,
        todolistId: string,
        userId: string,
    ): Promise<Result<ITodoEntity>> {
        const res = await this.userRepository.createTodo(
            todoBody,
            userId,
            todolistId,
        );
        if (!res) {
            return Err('todo create failed');
        }
        return Ok(res);
    }

    async getOneTodo(
        todoId: string,
        userId: string,
    ): Promise<Result<ITodoEntity>> {
        const res = await this.userRepository.getOneTodo(todoId, userId);
        if (!res) {
            return Err('todo not found', GenericErrorCode.NOT_FOUND);
        }
        return Ok(res);
    }

    async getAllTodo(
        userId: string,
        todolistId: string,
    ): Promise<Result<ITodoEntity[]>> {
        const res = await this.userRepository.getAllTodo(userId, todolistId);
        if (!res) {
            return Err('todos not found', GenericErrorCode.NOT_FOUND);
        }
        return Ok(res);
    }

    async deleteTodo(todoId: string, userId: string): Promise<Result<boolean>> {
        const res = await this.userRepository.deleteTodo(todoId, userId);
        if (!res) {
            return Err('delete todo failed');
        }
        return Ok(res);
    }

    async updateTodo(
        todoId: string,
        ITodo: Partial<ITodo>,
        userId: string,
    ): Promise<Result<ITodoEntity>> {
        const res = await this.userRepository.updateTodo(todoId, ITodo, userId);
        if (!res) {
            return Err('update todo failed');
        }
        return Ok(res);
    }
}
