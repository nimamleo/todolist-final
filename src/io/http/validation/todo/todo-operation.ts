import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { ITodoEntity } from 'src/model/todo.model';

export class CreateTodoDto {
    @IsString()
    @Length(3, 20)
    @ApiProperty()
    title: string;

    @IsString()
    @Length(3, 20)
    @ApiProperty()
    description: string;
}

export class TodoResponse {
    id: string;
    title: string;
    description: string;
    createdAt: string;

    // static mapTodoEntityToTodoResponse(
    //     todolistEntity: Partial<ITodoEntity>,
    // ): TodoResponse {
    //     const todoResponse = new TodoResponse();
    //     todoResponse._id = todolistEntity.id;
    //     todoResponse.title = todolistEntity.title;
    //     todoResponse.createdAt = todolistEntity.createdAt;

    //     return todoResponse;
    // }
}
