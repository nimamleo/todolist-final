import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { HandleError } from '../common/decorator/handler-error.decorator';
import { GenericErrorCode } from '../common/errors/generic-error';
import { Err, Ok, Result } from '../common/result';
import {
    IUserProvider,
    USER_DATABASE_PROVIDER,
} from '../infrastucture/database/provider/user.provider';
import { ITodolist, ITodolistEntity } from 'src/model/todolist.model';
import { INewUserEntity, IUser, IUserEntity } from 'src/model/user.model';
import {
    AUTH_JWT_PROVIDER,
    IAuthProvider,
} from '../infrastucture/Auth/provider/auth.provider';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enum/role.enum';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import { TokensInterface } from '../common/interface/tokens.interface';
import { RefreshTokenResponse } from '../io/http/users/models/refreshToken.model';
import { ITodo, ITodoEntity } from '../model/todo.model';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_DATABASE_PROVIDER)
        private readonly userRepository: IUserProvider,
        @Inject(AUTH_JWT_PROVIDER)
        private readonly authService: IAuthProvider, // @Inject(CACHE_MANAGER)
    ) // private cacheService: Cache,
    {}

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
        if (res.isError()) {
            return Err('create todolist failed');
        }
        return Ok(res.value);
    }

    @HandleError
    async getAllTodolist(userId: string): Promise<Result<ITodolistEntity[]>> {
        const res = await this.userRepository.getAllTodolist(userId);
        if (res.isError()) {
            return Err('get todolist failed');
        }
        return Ok(res.value);
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
        if (res.isError())
            return Err('todolist not found', GenericErrorCode.NOT_FOUND);
        return Ok(res.value);
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
        if (res.isError()) {
            return Err('delete todolist failed');
        }
        return Ok(res.value);
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
        if (!IsTodolistExists) {
            return Err('todolist does not exist');
        }
        const res = await this.userRepository.createTodo(
            todoBody,
            userId,
            todolistId,
        );
        if (res.isError()) {
            return Err('todo create failed');
        }
        return Ok(res.value);
    }

    @HandleError
    async getOneTodo(
        todoId: string,
        userId: string,
    ): Promise<Result<ITodoEntity>> {
        const res = await this.userRepository.getOneTodo(todoId, userId);
        if (res.isError()) {
            return Err('todo not found', GenericErrorCode.NOT_FOUND);
        }
        return Ok(res.value);
    }

    @HandleError
    async getAllTodo(
        userId: string,
        todolistId: string,
        page: number,
        perPage: number,
    ): Promise<Result<ITodoEntity[]>> {
        const IsTodolistExists = await this.userRepository.getOneTodoListById(
            todolistId,
            userId,
        );
        if (!IsTodolistExists) {
            return Err('todolist does not exist');
        }
        const res = await this.userRepository.getAllTodo(
            userId,
            todolistId,
            page,
            perPage,
        );
        if (res.isError()) {
            return Err('todos not found', GenericErrorCode.NOT_FOUND);
        }
        return Ok(res.value);
    }

    @HandleError
    async deleteTodo(todoId: string, userId: string): Promise<Result<boolean>> {
        const res = await this.userRepository.deleteTodo(todoId, userId);
        if (res.isError()) {
            return Err('delete todo failed');
        }
        return Ok(res.value);
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
        if (IsTodolistExists.isError()) {
            return Err('todolist does not exist');
        }
        const res = await this.userRepository.updateTodo(
            todoId,
            todolistId,
            ITodo,
            userId,
        );
        if (res.isError()) {
            return Err('update todo failed');
        }
        return Ok(res.value);
    }

    // ======================================  USER  ==============================================
    @HandleError
    async getUserById(id: string): Promise<Result<IUserEntity>> {
        const res = await this.userRepository.getUserById(id);
        if (res.isError()) {
            return Err('user not found');
        }
        return Ok(res.value);
    }

    @HandleError
    async createUser(userBody: Partial<IUser>): Promise<Result<IUserEntity>> {
        const res = await this.userRepository.createUser(userBody);
        if (res.isError()) {
            return Err('create user failed');
        }
        return Ok(res.value);
    }

    @HandleError
    async getUser(query: FilterQuery<unknown>) {
        return await this.userRepository.getUser(query);
    }

    @HandleError
    async deleteUserById(id: string): Promise<Result<boolean>> {
        const res = await this.userRepository.deleteUserById(id);
        if (res.isError()) {
            return Err('can not delete user with given id');
        }
        return Ok(res.value);
    }

    // ======================================  AUTH  ==============================================
    @HandleError
    async signIn(
        username: string,
        password: string,
    ): Promise<Result<TokensInterface>> {
        const user = await this.userRepository.getUser({ username });
        if (!user.value) {
            return Err('credential not valid');
        }
        const comparePassword = await bcrypt.compare(
            password,
            user.value.password,
        );
        if (!comparePassword) return Err('credential not valid');
        const tokens = await this.generateToken(user.value);
        const updateRes = await this.userRepository.updateUserRefreshToken(
            user.value.id,
            tokens.value.refreshToken,
        );
        if (!updateRes.value) {
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
        if (!updateRes.value) {
            return Err('logout failed');
        }
        return Ok(updateRes.value);
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

        const tokens = await this.generateToken(newUser.value);
        const updateRes = await this.userRepository.updateUserRefreshToken(
            newUser.value.id,
            tokens.value.refreshToken,
        );
        if (!updateRes.value) {
            return Err('signUp failed');
        }
        return Ok({
            id: newUser.value.id,
            username: newUser.value.username,
            password: hashedPassword.value,
            role: newUser.value.role,
            accessToken: tokens.value.accessToken,
            refreshToken: tokens.value.refreshToken,
            todoLists: newUser.value.todoLists,
            updatedAt: newUser.value.updatedAt,
            createdAt: newUser.value.createdAt,
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
