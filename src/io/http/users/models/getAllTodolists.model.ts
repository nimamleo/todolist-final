export class GetAllTodolistsRequest {}

export class GetAllTodolistsResponse {
    list: GetAllTodolistsResponseItem[];
}

export class GetAllTodolistsResponseItem {
    id: string;
    listTitle: string;
    todos: GetAllTodolistsResponseTodoItem[];
    createdAt: string;
}

export class GetAllTodolistsResponseTodoItem {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}
