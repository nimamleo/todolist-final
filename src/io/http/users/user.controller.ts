import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Headers,
    Patch,
    Res,
} from '@nestjs/common';
import { UserService } from 'src/application/user.service';
import {
    ApiConsumes,
    ApiExtraModels,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { response, Response } from 'express';
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

@Controller('users')
// @ApiExtraModels(StdResponse<>)
export class UserController extends AbstractHttpController {
    constructor(private readonly userService: UserService) {
        super();
    }
    // ======================================TODO LIST===========================================
    @Post('todolist')
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'create todolist' })
    @ApiExtraModels(TodolistResponse, StdResponse)
    @ApiStdResponse(TodolistResponse)
    async createTodolist(
        @Res() response: Response,
        @Body() body: TodolistRequest,
        @Headers('user') userId: string,
    ) {
        const res = await this.userService.createTodolist(
            {
                listTitle: body.listTitle,
            },
            userId,
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
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'get all todolist' })
    @ApiExtraModels(GetAllTodolistsResponse, StdResponse)
    @ApiStdResponse(GetAllTodolistsResponse)
    async getAllTodolist(
        @Res() response: Response,
        @Headers('user') userId: string,
    ) {
        const res = await this.userService.getAllTodolist(userId);
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
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'get todolist by id' })
    @ApiExtraModels(GetOneTodoListResponse, StdResponse)
    @ApiStdResponse(GetOneTodoListResponse)
    async getTodoListById(
        @Res() response: Response,
        @Headers('user') userId: string,
        @Param('id') todolistId: string,
    ) {
        const res = await this.userService.getOneTodoListById(
            userId,
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
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'delete todolist by id' })
    @ApiExtraModels(DeleteTodolistResponse, StdResponse)
    @ApiStdResponse(DeleteTodolistResponse)
    async deleteTodoListById(
        @Res() response: Response,
        @Headers('user') userId: string,
        @Param('id') todolistId: string,
    ) {
        const res = await this.userService.deleteTodolist(userId, todolistId);
        if (res.isError()) {
            super.sendResult(response, res);
        }
        if (res.isOk()) {
            super.sendResult(response, Ok<boolean>(res.value));
        }
    }

    // ======================================TODO ==============================================
    @Post('todo/:id')
    @ApiTags('Todo')
    @ApiOperation({ summary: 'create todo' })
    @ApiExtraModels(CreateTodoResponse, StdResponse)
    @ApiStdResponse(CreateTodoResponse)
    async createTodo(
        @Res() response: Response,
        @Body() body: CreateTodoRequest,
        @Headers('user') userId: string,
        @Param('id') todolistId: string,
    ): Promise<CreateTodoResponse> {
        const res = await this.userService.createTodo(body, todolistId, userId);
        console.log({ res });
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
    @ApiTags('Todo')
    @ApiOperation({ summary: 'get all todo' })
    @ApiExtraModels(GetAllTodoResponse, StdResponse)
    @ApiStdResponse(GetAllTodoResponse)
    async getAllTodo(
        @Res() response: Response,
        @Headers('user') userId: string,
        @Param('todolistId') todolistId: string,
    ): Promise<GetAllTodoResponse> {
        const res = await this.userService.getAllTodo(userId, todolistId);
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
    @ApiTags('Todo')
    @ApiOperation({ summary: 'get one todo' })
    @ApiExtraModels(GetOneTodoResponse, StdResponse)
    @ApiStdResponse(GetOneTodoResponse)
    async getOneTodo(
        @Res() response: Response,
        @Headers('user') userId: string,
        @Param('id') todoId: string,
    ): Promise<GetOneTodoResponse> {
        const res = await this.userService.getOneTodo(todoId, userId);
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
    @ApiTags('Todo')
    @ApiOperation({ summary: 'delete one todo' })
    @ApiExtraModels(DeleteTodoResponse, StdResponse)
    @ApiStdResponse(DeleteTodoResponse)
    async deleteOneTodo(
        @Res() response: Response,
        @Headers('user') userId: string,
        @Param('id') todoId: string,
    ): Promise<DeleteTodoResponse> {
        const res = await this.userService.deleteTodo(todoId, userId);
        if (res.isError()) {
            super.sendResult(response, res);
            return;
        }
        if (res.isOk()) {
            super.sendResult(response, Ok<boolean>(res.value));
        }
    }
    @Patch('todo/:todolistId/:todoId')
    @ApiTags('Todo')
    @ApiOperation({ summary: 'update one todo' })
    @ApiExtraModels(UpdateTodoResponse, StdResponse)
    @ApiStdResponse(UpdateTodoResponse)
    async updateTodo(
        @Res() response: Response,
        @Headers('user') userId: string,
        @Param('todoId') todoId: string,
        @Param('todolistId') todolistId: string,
        @Body() body: UpdateTodoRequest,
    ): Promise<UpdateTodoResponse> {
        const res = await this.userService.updateTodo(
            todoId,
            todolistId,
            body,
            userId,
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
    }

    @Delete(':id')
    @ApiTags('Users')
    @ApiOperation({ summary: 'delete user by id' })
    @ApiExtraModels(DeleteUserResponse, StdResponse)
    @ApiStdResponse(DeleteUserResponse)
    async delteUserById(
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
}
