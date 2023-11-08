import { ApiProperty } from '@nestjs/swagger';
import { GetAllTodolistsResponseTodoItem } from './getAllTodolists.model';

export class GetOneTodoListRequest {}

export class GetOneTodoListResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    listTitle: string;
    @ApiProperty({ type: () => GetOneTodolistsResponseTodoItem })
    todos: GetOneTodolistsResponseTodoItem[];
    @ApiProperty()
    createdAt: string;
}

export class GetOneTodolistsResponseTodoItem {
    @ApiProperty()
    id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    createdAt: string;
}
