import { ApiProperty } from '@nestjs/swagger';

export class GetOneTodoRequest {}

export class GetOneTodoResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    createdAt: string;
}
