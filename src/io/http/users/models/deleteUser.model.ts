import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserRequest {}
export class DeleteUserResponse {
    @ApiProperty()
    success: boolean;
}
