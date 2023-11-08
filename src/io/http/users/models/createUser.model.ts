import { IsNotEmpty, isString, length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
    Must,
    NotNull,
} from '../../../../common/validation/custom-validation/must-sync.rule';

export class UserRequest {
    @ApiProperty()
    @Must((x) => isString(x), NotNull, { message: 'username must be string' })
    @IsNotEmpty()
    @Must((x) => length(x, 6), NotNull, {
        message: 'username length must be more than 6',
    })
    username: string;

    @IsNotEmpty()
    @Must((x) => isString(x), NotNull, { message: 'password must be string' })
    @Must((x) => length(x, 3), NotNull, {
        message: 'password must length must be more than 3 char',
    })
    @ApiProperty()
    password: string;
}

export class UserResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    createdAt: string;
    @ApiProperty({ type: () => UserResponseTodolits })
    todoLists: UserResponseTodolits[];
}

export class UserResponseTodolits {
    @ApiProperty()
    id: string;
    @ApiProperty()
    listTitle: string;
    @ApiProperty({ type: () => TodolistResponseTodo })
    todos: TodolistResponseTodo[];
    @ApiProperty()
    createdAt: string;
}

export class TodolistResponseTodo {
    @ApiProperty()
    id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    createdAt: string;
}
