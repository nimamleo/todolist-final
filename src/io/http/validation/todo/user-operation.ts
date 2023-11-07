import { IsString, Length } from 'class-validator';
import { IUserEntity } from 'src/model/user.model';
import { TodolistResponse } from './todolist-operation';
import { ApiProperty } from '@nestjs/swagger';

export class UserRequest {
    @IsString()
    @Length(3, 20)
    @ApiProperty()
    username: string;

    @IsString()
    @Length(3, 20)
    @ApiProperty()
    password: string;
}

export class UserResponse {
    id: string;
    username: string;
    createdAt: string;
    todoLists: UserResponseTodolits[];
}

export class UserResponseTodolits {
    id: string;
    listTitle: string;
    todos: TodolistResponseTodo[];
    createdAt: string;
}

export class TodolistResponseTodo {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}
