import { ApiProperty } from '@nestjs/swagger';

export class DeleteTodolistRequest {}
export class DeleteTodolistResponse {
    @ApiProperty()
    success: boolean;
}
