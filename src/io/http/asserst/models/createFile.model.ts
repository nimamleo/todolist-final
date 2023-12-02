import { ApiProperty } from '@nestjs/swagger';

export class CreateFileRequest {}
export class CreateFileResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    size: number;

    @ApiProperty()
    filePath: string;

    @ApiProperty()
    mimetype: string;

    @ApiProperty()
    todoId: string;

    @ApiProperty()
    createdAt: string;
}
