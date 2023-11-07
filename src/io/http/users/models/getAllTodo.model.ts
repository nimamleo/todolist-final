export class GetAllTodoRequest {}

export class GetAllTodoResponse {
    list: GetAllTodoResponseItem[];
}

export class GetAllTodoResponseItem {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}
