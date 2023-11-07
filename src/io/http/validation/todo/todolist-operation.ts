import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { User } from 'src/infrastucture/database/mongo/schema/user.schema';
import { ITodoEntity } from 'src/model/todo.model';
import { ITodolistEntity } from 'src/model/todolist.model';
import { TodoResponse } from './todo-operation';

export class CreateTodolistDto {
    @IsString()
    @Length(3, 20)
    @ApiProperty()
    listTitle: string;
}

export class TodolistResponse {
    id: string;
    listTitle: string;
    createdAt: string;
    todos: TodolistResponseTodoItem[];
}

export class TodolistResponseTodoItem {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}
