export class GetOneTodoListRequest {}

export class GetOneTodoListResponse {
    id: string;
    listTitle: string;
    todos: GetOneTodolistsResponseTodoItem[];
    createdAt: string;
}

export class GetOneTodolistsResponseTodoItem {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}
