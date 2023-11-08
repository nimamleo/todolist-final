import { ApiProperty } from '@nestjs/swagger';
import { TodolistResponseTodo } from './createUser.model';

export class GetAllTodoRequest {}

export class GetAllTodoResponse {
    @ApiProperty({ type: () => GetAllTodoResponseItem })
    list: GetAllTodoResponseItem[];
}

export class GetAllTodoResponseItem {
    @ApiProperty()
    id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    createdAt: string;
}
