import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { UserResponseTodolits } from './createUser.model';

export class CreateTodolistDto {
    @IsString()
    @Length(3, 20)
    @ApiProperty()
    listTitle: string;
}

export class TodolistResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    listTitle: string;
    @ApiProperty()
    createdAt: string;
    @ApiProperty({ type: () => TodolistResponseTodoItem })
    todos: TodolistResponseTodoItem[];
}

export class TodolistResponseTodoItem {
    @ApiProperty()
    id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    createdAt: string;
}
