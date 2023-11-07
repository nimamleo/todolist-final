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
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTodoDto, TodoResponse } from '../validation/todo/todo-operation';
import { UserRequest } from 'src/io/http/validation/todo/user-operation';
import {
    CreateTodolistDto,
    TodolistResponse,
} from '../validation/todo/todolist-operation';
import { UpdateTodoDto } from '../validation/todo/update-todo.dto';
import { Response } from 'express';
import { AbstractHttpController } from '../../../common/abstract-http.controller';
import { UserResponse } from '../validation/todo/user-operation';
import { Ok } from 'src/common/result';
import { title } from 'process';

@Controller('users')
export class UserController extends AbstractHttpController {
    constructor(private readonly userService: UserService) {
        super();
    }
    // ======================================TODO LIST===========================================
    @Post('todolist')
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'create todolist' })
    async createTodolist(
        @Res() response: Response,
        @Body() body: CreateTodolistDto,
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
                todos: res.value.todos.map((x) => ({
                    title: x.title,
                    id: x.id,
                    createdAt: x.createdAt.toISOString(),
                    description: x.description,
                })),
            }),
        );
    }
    @Get('todolist')
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'get all todolist' })
    async getAllTodolist(
        @Res() response: Response,
        @Headers('user') userId: string,
    ) {
        const res = await this.userService.getAllTodolist(userId);
        if (res.isError()) return;
        console.log(res);

        // if (res.isOk) {
        //     return super.sendResult(
        //         response,
        //         Ok<TodolistResponse[]>(
        //             res.value.map((x) =>
        //                 TodolistResponse.mapTodolistEntityToTodolistResponse(x),
        //             ),
        //         ),
        //     );
        // }
    }

    @Get('todolist/:id')
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'get todolist by id' })
    async getTodoListById(
        @Res() response: Response,
        @Headers('user') userId: string,
        @Param('id') todolistId: string,
    ) {
        const res = await this.userService.getOneTodoListById(
            userId,
            todolistId,
        );
        console.log(res);

        if (res.isError) return;
        // if (res.isOk) {
        //     return super.sendResult(
        //         response,
        //         Ok<TodolistResponse>(
        //             TodolistResponse.mapTodolistEntityToTodolistResponse(
        //                 res.value,
        //             ),
        //         ),
        //     );
        // }
    }

    @Delete('todolist/:id')
    @ApiTags('Todolist')
    @ApiOperation({ summary: 'delete todolist by id' })
    deleteTodoListById(
        @Headers('user') userId: string,
        @Param('id') todolistId: string,
    ) {
        const res = this.userService.deleteTodolist(userId, todolistId);
    }

    // ======================================TODO ==============================================
    @Post('todo/:id')
    @ApiTags('Todo')
    @ApiOperation({ summary: 'create todo' })
    @ApiConsumes('application/x-www-form-urlencoded')
    async createTodo(
        @Body() body: CreateTodoDto,
        @Headers('user') userId: string,
        @Param('id') todolistId: string,
    ) {
        const res = await this.userService.createTodo(body, todolistId, userId);
    }

    @Get('todo/:id')
    @ApiTags('Todo')
    @ApiOperation({ summary: 'get one todo' })
    async getOneTodo(
        @Headers('user') userId: string,
        @Param('id') todoId: string,
    ) {
        const res = await this.userService.getOneTodo(todoId, userId);
    }
    @Get('todo/todos/:todolistId')
    @ApiTags('Todo')
    @ApiOperation({ summary: 'get all todo' })
    async getAllTodo(
        @Headers('user') userId: string,
        @Param('todolistId') todolistId: string,
    ) {
        const res = await this.userService.getAllTodo(userId, todolistId);
    }
    @Delete('todo/:id')
    @ApiTags('Todo')
    @ApiOperation({ summary: 'delete one todo' })
    async deleteOneTodo(
        @Headers('user') userId: string,
        @Param('id') todoId: string,
    ) {
        const res = await this.userService.deleteTodo(todoId, userId);
    }
    @Patch('todo/:id')
    @ApiTags('Todo')
    @ApiOperation({ summary: 'update one todo' })
    async updateTodo(
        @Headers('user') userId: string,
        @Param('id') todoId: string,
        @Body() body: UpdateTodoDto,
    ) {
        const res = await this.userService.updateTodo(todoId, body, userId);
    }
    // ======================================USER ==============================================

    @Get(':id')
    @ApiTags('Users')
    @ApiOperation({ summary: 'get user by id' })
    async getUserById(@Res() response: Response, @Param('id') userId: string) {
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
    async delteUserById(
        @Res() response: Response,
        @Param('id') userId: string,
    ) {
        const res = await this.userService.deleteUserById(userId);
        if (res.isError()) {
            return;
        }
        // if (res.isOk()) {
        //     super.sendResult(
        //         response,
        //         Ok<boolean>(UserResponse.userDeleteResponse(res.value)),
        //     );
        // }
    }
    @Post()
    @ApiTags('Users')
    @ApiOperation({ summary: 'create user' })
    @ApiConsumes('application/x-www-form-urlencoded')
    async createUser(@Res() response: Response, @Body() body: UserRequest) {
        const res = await this.userService.createUser({
            username: body.username,
            password: body.password,
        });
        if (res.isError()) {
            return;
        }
        // if (res.isOk()) {
        //     super.sendResult(
        //         response,
        //         Ok<UserResponse>(
        //             UserResponse.mapUserEntityToUserResponse(res.value),
        //         ),
        //     );
        // }
    }
}
