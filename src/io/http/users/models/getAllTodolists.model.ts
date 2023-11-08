import { ApiProperty } from '@nestjs/swagger';

export class GetAllTodolistsRequest {}

export class GetAllTodolistsResponse {
    @ApiProperty({ type: () => GetAllTodolistsResponseItem })
    list: GetAllTodolistsResponseItem[];
}

export class GetAllTodolistsResponseItem {
    @ApiProperty()
    id: string;
    @ApiProperty()
    listTitle: string;
    @ApiProperty({ type: () => GetAllTodolistsResponseTodoItem })
    todos: GetAllTodolistsResponseTodoItem[];
    @ApiProperty()
    createdAt: string;
}

export class GetAllTodolistsResponseTodoItem {
    @ApiProperty()
    id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    createdAt: string;
}
