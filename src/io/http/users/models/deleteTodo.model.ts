import { ApiProperty } from '@nestjs/swagger';

export class DeleteTodoRequest {}
export class DeleteTodoResponse {
    @ApiProperty()
    success: boolean;
}
