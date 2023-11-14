import { IsNotEmpty, isString, length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
    Must,
    NotNull,
} from '../../../../common/validation/custom-validation/must-sync.rule';

export class SignUpRequest {
    @ApiProperty()
    @IsNotEmpty()
    @Must((x) => isString(x), NotNull, { message: 'username must be string' })
    @Must((x) => length(x, 3), NotNull, {
        message: 'username length must be more than 3',
    })
    username: string;

    @IsNotEmpty()
    @Must((x) => isString(x), NotNull, { message: 'password must be string' })
    @Must((x) => length(x, 3), NotNull, {
        message: 'password must length must be more than 3 char',
    })
    @ApiProperty()
    password: string;
}

export class SignUpResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    token: string;
    @ApiProperty()
    createdAt: string;
}
