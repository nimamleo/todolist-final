import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetOneTodolistsResponseTodoItem } from './getOneTodoList.model';

// export class getUserRequest {
//     @IsString()
//     id: string;
// }

export class UserTodolists {
    @ApiProperty()
    id: string;
    @ApiProperty()
    listTitle: string;
    @ApiProperty({ type: () => TodolitsTodos })
    todos: TodolitsTodos[];
    @ApiProperty()
    createdAt: string;
}

export class TodolitsTodos {
    @ApiProperty()
    id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    createdAt: string;
}

export class getUserResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    createdAt: string;
    @ApiProperty({ type: () => UserTodolists })
    todoLists: UserTodolists[];
}
