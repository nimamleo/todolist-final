import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRequest {
    @IsString()
    @Length(3, 20)
    @ApiProperty()
    @Matches(/^aa..b..ccc$/, {
        message:
            'first two letter be a & last three letter be c & forth letter be b',
    })
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
