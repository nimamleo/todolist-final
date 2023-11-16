import { ApiProperty } from '@nestjs/swagger';

export class LogoutRequest {
    @ApiProperty()
    userId: string;
}
export class LogoutResponse {
    success: boolean;
}
