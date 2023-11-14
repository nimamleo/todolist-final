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
import { INewUserEntity, IUser, IUserEntity } from 'src/model/user.model';
import {
    AUTH_JWT_PROVIDER,
    IAuthProvider,
} from '../infrastucture/Auth/provider/auth.provider';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enum/role.enum';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_DATABASE_PROVIDER)
        private readonly userRepository: IUserProvider,
        @Inject(AUTH_JWT_PROVIDER)
        private readonly authService: IAuthProvider,
    ) {}

    // ======================================TODO LIST ==============================================
    @HandleError
    async createTodolist(
        todolistBody: Partial<ITodolist>,
        userId: string,
    ): Promise<Result<ITodolistEntity>> {
        console.log({ userId });
        const res = await this.userRepository.createTodolist(
            todolistBody,
            userId,
        );
        if (!res) {
            return Err('create todolist failed');
        }
        return Ok(res);
    }

    @HandleError
    async getAllTodolist(userId: string): Promise<Result<ITodolistEntity[]>> {
        const res = await this.userRepository.getAllTodolist(userId);
        if (!res) {
            return Err('create todolist failed');
        }
        return Ok(res);
    }

    @HandleError
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

    @HandleError
    async getOneTodoList(userId: string, query: FilterQuery<unknown>) {
        const res = await this.userRepository.getOneTodoList(query, userId);
    }

    @HandleError
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

    // ======================================TODO ==============================================
    @HandleError
    async createTodo(
        todoBody: Partial<ITodo>,
        todolistId: string,
        userId: string,
    ): Promise<Result<ITodoEntity>> {
        const IsTodolistExists = await this.userRepository.getOneTodoListById(
            todolistId,
            userId,
        );
        if (IsTodolistExists) {
            return Err('todolist does not exist');
        }
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

    @HandleError
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

    @HandleError
    async getAllTodo(
        userId: string,
        todolistId: string,
    ): Promise<Result<ITodoEntity[]>> {
        const IsTodolistExists = await this.userRepository.getOneTodoListById(
            todolistId,
            userId,
        );
        if (IsTodolistExists) {
            return Err('todolist does not exist');
        }
        const res = await this.userRepository.getAllTodo(userId, todolistId);
        if (!res) {
            return Err('todos not found', GenericErrorCode.NOT_FOUND);
        }
        return Ok(res);
    }

    @HandleError
    async deleteTodo(todoId: string, userId: string): Promise<Result<boolean>> {
        const res = await this.userRepository.deleteTodo(todoId, userId);
        if (!res) {
            return Err('delete todo failed');
        }
        return Ok(res);
    }

    @HandleError
    async updateTodo(
        todoId: string,
        todolistId: string,
        ITodo: Partial<ITodo>,
        userId: string,
    ): Promise<Result<ITodoEntity>> {
        const IsTodolistExists = await this.userRepository.getOneTodoListById(
            todolistId,
            userId,
        );
        if (IsTodolistExists) {
            return Err('todolist does not exist');
        }
        const res = await this.userRepository.updateTodo(
            todoId,
            todolistId,
            ITodo,
            userId,
        );
        if (!res) {
            return Err('update todo failed');
        }
        return Ok(res);
    }

    // ======================================  USER  ==============================================
    @HandleError
    async getUserById(id: string): Promise<Result<IUserEntity>> {
        const res = await this.userRepository.getUserById(id);
        if (!res) {
            return Err('user not found');
        }
        return Ok(res);
    }

    @HandleError
    async createUser(userBody: Partial<IUser>): Promise<Result<IUserEntity>> {
        const res = await this.userRepository.createUser(userBody);
        if (!res) {
            return Err('create user failed');
        }
        return Ok(res);
    }

    @HandleError
    async getUser(query: FilterQuery<unknown>) {
        const res = await this.userRepository.getUser(query);
    }

    @HandleError
    async deleteUserById(id: string): Promise<Result<boolean>> {
        const res = await this.userRepository.deleteUserById(id);
        if (!res) {
            return Err('can not delete user with given id');
        }
        return Ok(res);
    } // ======================================  AUTH  ==============================================
    @HandleError
    async signIn(username: string, password: string): Promise<Result<string>> {
        const user = await this.userRepository.getUser({ username });
        if (!user) {
            return Err('credential not valid');
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) return Err('credential not valid');
        const tokenRes = await this.generateToken(user);
        return Ok(tokenRes.value);
    }

    @HandleError
    async signUp(
        username: string,
        password: string,
    ): Promise<Result<INewUserEntity>> {
        const user = await this.userRepository.getUser({ username: username });
        if (user) {
            return Err('this user already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.userRepository.createUser({
            username: username,
            password: hashedPassword,
            role: Role.USER,
        });
        const res = await this.authService.signToken(
            newUser.id,
            newUser.username,
            Role.USER,
        );
        return Ok({
            id: newUser.id,
            username: newUser.username,
            password: hashedPassword,
            role: newUser.role,
            todoLists: newUser.todoLists,
            token: res.value,
            updatedAt: newUser.updatedAt,
            createdAt: newUser.createdAt,
        });
    }

    @HandleError
    async generateToken(user: IUserEntity): Promise<Result<string>> {
        const tokenRes = await this.authService.signToken(
            user.id,
            user.username,
            Role.USER,
        );

        if (tokenRes.isError()) {
            return Err(tokenRes.err);
        }

        return Ok(tokenRes.value);
    }
}
