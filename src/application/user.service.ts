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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TokensInterface } from '../common/interface/tokens.interface';
import { compare } from 'bcrypt';
import { use } from 'passport';
import { RefreshTokenResponse } from '../io/http/users/models/refreshToken.model';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_DATABASE_PROVIDER)
        private readonly userRepository: IUserProvider,
        @Inject(AUTH_JWT_PROVIDER)
        private readonly authService: IAuthProvider,
        @Inject(CACHE_MANAGER)
        private cacheService: Cache,
    ) {}

    // ======================================TODO LIST ==============================================
    @HandleError
    async createTodolist(
        todolistBody: Partial<ITodolist>,
        userId: string,
    ): Promise<Result<ITodolistEntity>> {
        const res = await this.userRepository.createTodolist(
            todolistBody,
            userId,
        );
        await this.cacheService.set(res.id, res, 60000);
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
        const cachedData = await this.cacheService.get<ITodolistEntity>(
            todolistId.toString(),
        );
        if (cachedData) {
            console.log(`Getting data from cache!`);
            return Ok(cachedData);
        }
        const res = await this.userRepository.getOneTodoListById(
            userId,
            todolistId,
        );
        if (!res) return Err('todolist not found', GenericErrorCode.NOT_FOUND);
        return Ok(res);
    }

    @HandleError
    async getOneTodoList(userId: string, query: FilterQuery<unknown>) {
        return await this.userRepository.getOneTodoList(query, userId);
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
            userId,
            todolistId,
        );
        if (!IsTodolistExists) {
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
        return await this.userRepository.getUser(query);
    }

    @HandleError
    async deleteUserById(id: string): Promise<Result<boolean>> {
        const res = await this.userRepository.deleteUserById(id);
        if (!res) {
            return Err('can not delete user with given id');
        }
        return Ok(res);
    }

    // ======================================  AUTH  ==============================================
    @HandleError
    async signIn(
        username: string,
        password: string,
    ): Promise<Result<TokensInterface>> {
        const user = await this.userRepository.getUser({ username });
        if (!user) {
            return Err('credential not valid');
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) return Err('credential not valid');
        const tokens = await this.generateToken(user);
        const updateRes = await this.userRepository.updateUserRefreshToken(
            user.id,
            tokens.value.refreshToken,
        );
        if (!updateRes) {
            return Err('signIn failed');
        }

        return Ok(tokens.value);
    }
    @HandleError
    async logout(userId: string): Promise<Result<boolean>> {
        const updateRes = await this.userRepository.updateUserRefreshToken(
            userId,
            null,
        );
        if (!updateRes) {
            return Err('logout failed');
        }
        return Ok(updateRes);
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
        const hashedPassword = await this.hashData(password);

        const newUser = await this.userRepository.createUser({
            username: username,
            password: hashedPassword.value,
            role: Role.USER,
        });

        const tokens = await this.generateToken(newUser);
        const updateRes = await this.userRepository.updateUserRefreshToken(
            newUser.id,
            tokens.value.refreshToken,
        );
        if (!updateRes) {
            return Err('signUp failed');
        }
        return Ok({
            id: newUser.id,
            username: newUser.username,
            password: hashedPassword.value,
            role: newUser.role,
            accessToken: tokens.value.accessToken,
            refreshToken: tokens.value.refreshToken,
            todoLists: newUser.todoLists,
            updatedAt: newUser.updatedAt,
            createdAt: newUser.createdAt,
        });
    }

    @HandleError
    async generateToken(user: IUserEntity): Promise<Result<TokensInterface>> {
        const tokenRes = await this.authService.signTokens(
            user.id,
            user.username,
            Role.USER,
        );

        if (tokenRes.isError()) {
            return Err(tokenRes.err);
        }

        return Ok(tokenRes.value);
    }
    @HandleError
    async hashData(data: any): Promise<Result<string>> {
        const hashedData = await bcrypt.hash(data, 10);

        if (!hashedData) {
            return Err('hashed process failed');
        }

        return Ok(hashedData);
    }
    @HandleError
    async updateRefreshToken(
        refreshToken: string,
    ): Promise<Result<RefreshTokenResponse>> {
        const userId = await this.authService.verifyToken(refreshToken);
        const user = await this.getUserById(userId.value);
        if (!user) return Err('user not found', GenericErrorCode.NOT_FOUND);

        const tokens = await this.generateToken(user.value);
        if (tokens.isError()) {
            return Err('login failed');
        }

        const updateResult = await this.userRepository.updateUserRefreshToken(
            user.value.id,
            tokens.value.refreshToken,
        );
        if (!updateResult) {
            return Err('login failed');
        }

        return Ok({
            accessToken: tokens.value.accessToken,
            refreshToken: tokens.value.refreshToken,
        });
    }
}
