import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/application/user.service';
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AbstractHttpController } from '../../../common/abstract-http.controller';
import { Ok } from 'src/common/result';
import { GetAllTodolistsResponse } from './models/getAllTodolists.model';
import { GetOneTodoListResponse } from './models/getOneTodoList.model';
import { UserRequest, UserResponse } from './models/createUser.model';
import {
    CreateTodoRequest,
    CreateTodoResponse,
} from './models/createTodo.model';
import { GetOneTodoResponse } from './models/getOneTodo.model';
import { GetAllTodoResponse } from './models/getAllTodo.model';
import {
    UpdateTodoRequest,
    UpdateTodoResponse,
} from './models/updateTodo.model';
import { ApiStdResponse } from '../../../common/ApiStdResponse';
import { DeleteUserResponse } from './models/deleteUser.model';
import { DeleteTodoResponse } from './models/deleteTodo.model';
import { DeleteTodolistResponse } from './models/deleteTodolist.model';
import {
    TodolistRequest,
    TodolistResponse,
} from './models/createTodolist.model';
import { StdResponse } from '../../../common/std-response/std-response';
import { SignUpRequest, SignUpResponse } from './models/signUp.model';
import { SignInRequest, SignInResponse } from './models/signIn.model';
import { JwtAuthGuard } from '../../../infrastucture/Auth/JWT/guards/jwt.guard';
import { GetUser } from '../../../common/decorator/get-user.decorator';
import { IUserEntity } from '../../../model/user.model';
import { Roles } from '../../../common/decorator/roles.decorator';
import { Role } from '../../../common/enum/role.enum';
import { RoleGuard } from '../../../common/guard/role.guard';
import {
    RefreshTokenRequest,
    RefreshTokenResponse,
} from './models/refreshToken.model';
import { LogoutRequest, LogoutResponse } from './models/logout.model';

@Controller('users')

// @ApiExtraModels(StdResponse<>)
export class UserController extends AbstractHttpController {
    constructor(private readonly userService: UserService) {
        super();
    }
    // ======================================  TODO LIST  ===========================================
    @Post('todolist')
    @UseGuards(new JwtAuthGuard(true))
    @ApiBearerAuth()
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'create todolist' })
    @ApiExtraModels(TodolistResponse, StdResponse)
    @ApiStdResponse(TodolistResponse)
    async createTodolist(
        @Res() response: Response,
        @Body() body: TodolistRequest,
        @GetUser() user: IUserEntity,
    ) {
        const res = await this.userService.createTodolist(
            {
                listTitle: body.listTitle,
            },
            user.id,
        );
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        super.sendResult(
            response,
            Ok<TodolistResponse>({
                id: res.value.id,
                listTitle: res.value.listTitle,
                createdAt: res.value.createdAt.toISOString(),
                todos: [],
            }),
        );
    }
    @Get('todolist')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'get all todolist' })
    @ApiExtraModels(GetAllTodolistsResponse, StdResponse)
    @ApiStdResponse(GetAllTodolistsResponse)
    async getAllTodolist(
        @Res() response: Response,
        @GetUser() user: IUserEntity,
    ) {
        const res = await this.userService.getAllTodolist(user.id);
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }

        if (res.isOk) {
            return super.sendResult(
                response,
                Ok<GetAllTodolistsResponse>({
                    list: res.value.map((todolist) => ({
                        id: todolist.id,
                        listTitle: todolist.listTitle,
                        createdAt: todolist.createdAt.toISOString(),
                        todos: todolist.todos.map((todo) => ({
                            id: todo.id,
                            title: todo.title,
                            description: todo.description,
                            createdAt: todo.createdAt.toISOString(),
                        })),
                    })),
                }),
            );
        }
    }

    @Get('todolist/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'get todolist by id' })
    @ApiExtraModels(GetOneTodoListResponse, StdResponse)
    @ApiStdResponse(GetOneTodoListResponse)
    async getTodoListById(
        @Res() response: Response,
        @GetUser() user: IUserEntity,
        @Param('id') todolistId: string,
    ) {
        const res = await this.userService.getOneTodoListById(
            user.id,
            todolistId,
        );

        if (res.isError) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<GetOneTodoListResponse>({
                    id: res.value.id,
                    listTitle: res.value.listTitle,
                    createdAt: res.value.createdAt.toISOString(),
                    todos: res.value.todos.map((todo) => ({
                        id: todo.id,
                        title: todo.title,
                        description: todo.description,
                        createdAt: todo.createdAt.toISOString(),
                    })),
                }),
            );
        }
    }

    @Delete('todolist/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'delete todolist by id' })
    @ApiExtraModels(DeleteTodolistResponse, StdResponse)
    @ApiStdResponse(DeleteTodolistResponse)
    async deleteTodoListById(
        @Res() response: Response,
        @GetUser() user: IUserEntity,
        @Param('id') todolistId: string,
    ) {
        const res = await this.userService.deleteTodolist(user.id, todolistId);
        if (res.isError()) {
            super.sendResult(response, res);
        }
        if (res.isOk()) {
            super.sendResult(response, Ok<boolean>(res.value));
        }
    }

    // ======================================TODO ==============================================
    @Post('todo/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('Todo')
    @ApiOperation({ summary: 'create todo' })
    @ApiExtraModels(CreateTodoResponse, StdResponse)
    @ApiStdResponse(CreateTodoResponse)
    async createTodo(
        @Res() response: Response,
        @Body() body: CreateTodoRequest,
        @GetUser() user: IUserEntity,
        @Param('id') todolistId: string,
    ): Promise<CreateTodoResponse> {
        const res = await this.userService.createTodo(
            body,
            todolistId,
            user.id,
        );
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<CreateTodoResponse>({
                    id: res.value.id,
                    title: res.value.title,
                    description: res.value.description,
                    createdAt: res.value.createdAt.toISOString(),
                }),
            );
        }
    }

    @Get('todo/todos/:todolistId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('Todo')
    @ApiOperation({ summary: 'get all todo' })
    @ApiExtraModels(GetAllTodoResponse, StdResponse)
    @ApiStdResponse(GetAllTodoResponse)
    async getAllTodo(
        @Res() response: Response,
        @GetUser() user: IUserEntity,
        @Param('todolistId') todolistId: string,
    ): Promise<GetAllTodoResponse> {
        const res = await this.userService.getAllTodo(user.id, todolistId);
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<GetAllTodoResponse>({
                    list: res.value.map((todo) => ({
                        id: todo.id,
                        title: todo.title,
                        description: todo.description,
                        createdAt: todo.createdAt.toISOString(),
                    })),
                }),
            );
        }
    }
    @Get('todo/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('Todo')
    @ApiOperation({ summary: 'get one todo' })
    @ApiExtraModels(GetOneTodoResponse, StdResponse)
    @ApiStdResponse(GetOneTodoResponse)
    async getOneTodo(
        @Res() response: Response,
        @GetUser() user: IUserEntity,
        @Param('id') todoId: string,
    ): Promise<GetOneTodoResponse> {
        const res = await this.userService.getOneTodo(todoId, user.id);
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<GetOneTodoResponse>({
                    id: res.value.id,
                    title: res.value.title,
                    description: res.value.description,
                    createdAt: res.value.createdAt.toISOString(),
                }),
            );
        }
    }
    @Delete('todo/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('Todo')
    @ApiOperation({ summary: 'delete one todo' })
    @ApiExtraModels(DeleteTodoResponse, StdResponse)
    @ApiStdResponse(DeleteTodoResponse)
    async deleteOneTodo(
        @Res() response: Response,
        @GetUser() user: IUserEntity,
        @Param('id') todoId: string,
    ): Promise<DeleteTodoResponse> {
        const res = await this.userService.deleteTodo(todoId, user.id);
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(response, Ok<boolean>(res.value));
        }
    }
    @Patch('todo/:todolistId/:todoId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('Todo')
    @ApiOperation({ summary: 'update one todo' })
    @ApiExtraModels(UpdateTodoResponse, StdResponse)
    @ApiStdResponse(UpdateTodoResponse)
    async updateTodo(
        @Res() response: Response,
        @GetUser() user: IUserEntity,
        @Param('todoId') todoId: string,
        @Param('todolistId') todolistId: string,
        @Body() body: UpdateTodoRequest,
    ): Promise<UpdateTodoResponse> {
        const res = await this.userService.updateTodo(
            todoId,
            todolistId,
            body,
            user.id,
        );
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<UpdateTodoResponse>({
                    id: res.value.id,
                    title: res.value?.title,
                    description: res.value?.description,
                    updatedAt: res.value.updatedAt.toISOString(),
                }),
            );
        }
    }
    // ======================================USER ==============================================

    @Get(':id')
    @Roles(Role.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiBearerAuth()
    @ApiTags('Users')
    @ApiOperation({ summary: 'get user by id' })
    @ApiExtraModels(UserResponse, StdResponse)
    @ApiStdResponse(UserResponse)
    async getUserById(
        @Res() response: Response,
        @Param('id') userId: string,
    ): Promise<UserResponse> {
        const res = await this.userService.getUserById(userId);
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        super.sendResult(
            response,
            Ok<UserResponse>({
                id: res.value.id,
                username: res.value.username,
                createdAt: res.value.createdAt.toISOString(),
                todoLists: res.value.todoLists.map((todolist) => ({
                    id: todolist.id,
                    listTitle: todolist.listTitle,
                    createdAt: todolist.createdAt.toISOString(),
                    todos: todolist.todos.map((todo) => ({
                        id: todo.id,
                        title: todo.title,
                        description: todo.description,
                        createdAt: todo.createdAt.toISOString(),
                    })),
                })),
            }),
        );
        return;
    }

    @Delete(':id')
    @UseGuards(new JwtAuthGuard(true))
    @ApiBearerAuth()
    @ApiTags('Users')
    @ApiOperation({ summary: 'delete user by id' })
    @ApiExtraModels(DeleteUserResponse, StdResponse)
    @ApiStdResponse(DeleteUserResponse)
    async deleteUserById(
        @Res() response: Response,
        @Param('id') userId: string,
    ): Promise<DeleteUserResponse> {
        const res = await this.userService.deleteUserById(userId);
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<DeleteUserResponse>({ success: res.value }),
            );
        }
    }
    @Post()
    @ApiTags('Users')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'create user' })
    @ApiStdResponse(UserResponse)
    @ApiExtraModels(UserResponse, StdResponse)
    async createUser(
        @Res() response: Response,
        @Body() body: UserRequest,
    ): Promise<UserResponse> {
        const res = await this.userService.createUser({
            username: body.username,
            password: body.password,
        });
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<UserResponse>({
                    id: res.value.id,
                    username: res.value.username,
                    createdAt: res.value.createdAt.toISOString(),
                    todoLists: res.value.todoLists.map((todolist) => ({
                        id: todolist.id,
                        listTitle: todolist.listTitle,
                        createdAt: todolist.createdAt.toISOString(),
                        todos: todolist.todos.map((todo) => ({
                            id: todo.id,
                            title: todo.title,
                            description: todo.description,
                            createdAt: todo.createdAt.toISOString(),
                        })),
                    })),
                }),
            );
        }
    }
    // ======================================Auth ==============================================
    @Post('auth/signIn')
    @ApiTags('Auth')
    @ApiOperation({ summary: 'signIn' })
    @ApiExtraModels(SignInResponse, StdResponse)
    @ApiStdResponse(SignInResponse)
    async signIn(
        @Res() response: Response,
        @Body() body: SignInRequest,
    ): Promise<SignInResponse> {
        const res = await this.userService.signIn(body.username, body.password);
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<SignInResponse>({
                    accessToken: res.value.accessToken,
                    refreshToken: res.value.refreshToken,
                }),
            );
        }
        return;
    }
    @Post('auth/signUp')
    @ApiTags('Auth')
    @ApiOperation({ summary: 'signUp' })
    @ApiExtraModels(SignUpResponse, StdResponse)
    @ApiStdResponse(SignUpResponse)
    async signUp(
        @Res() response: Response,
        @Body() body: SignUpRequest,
    ): Promise<SignUpResponse> {
        const res = await this.userService.signUp(body.username, body.password);
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<SignUpResponse>({
                    username: res.value.username,
                    id: res.value.id,
                    createdAt: res.value.createdAt.toISOString(),
                    accessToken: res.value.accessToken,
                }),
            );
        }
        return;
    }
    @Get('auth/logout/:id')
    @ApiTags('Auth')
    @ApiOperation({ summary: 'logout' })
    @ApiExtraModels(LogoutResponse, StdResponse)
    @ApiStdResponse(LogoutResponse)
    async logout(
        @Res() response: Response,
        @Param('id') userId: string,
    ): Promise<LogoutResponse> {
        const res = await this.userService.logout(userId);
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<LogoutResponse>({
                    success: res.value,
                }),
            );
        }
        return;
    }
    @Post('auth/refresh')
    @ApiTags('Auth')
    @ApiOperation({ summary: 'update refresh token' })
    @ApiExtraModels(RefreshTokenResponse, StdResponse)
    @ApiStdResponse(RefreshTokenResponse)
    async refreshToken(
        @Res() response: Response,
        @Body() body: RefreshTokenRequest,
    ): Promise<RefreshTokenResponse> {
        const res = await this.userService.updateRefreshToken(
            body.refreshToken,
        );
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<RefreshTokenResponse>({
                    refreshToken: res.value.refreshToken,
                    accessToken: res.value.accessToken,
                }),
            );
        }
    }
}
