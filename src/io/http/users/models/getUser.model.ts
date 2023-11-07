import { IsString } from 'class-validator';

// export class getUserRequest {
//     @IsString()
//     id: string;
// }

export class UserTodolists {
    id: string;
    listTitle: string;
    todos: TodolitsTodos[];
    createdAt: string;
}

export class TodolitsTodos {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}

export class getUserResponse {
    id: string;
    username: string;
    createdAt: string;
    todoLists: UserTodolists[];
}
