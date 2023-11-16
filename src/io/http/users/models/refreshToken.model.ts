import { ApiProperty } from '@nestjs/swagger';
import {
    Must,
    NotNull,
} from '../../../../common/validation/custom-validation/must-sync.rule';
import { IsNotEmpty, isString } from 'class-validator';

export class RefreshTokenRequest {
    @ApiProperty()
    @IsNotEmpty()
    @Must((x) => isString(x), NotNull)
    refreshToken: string;
}
export class RefreshTokenResponse {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}
