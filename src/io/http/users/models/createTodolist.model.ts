import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, length } from 'class-validator';
import { UserResponseTodolits } from './createUser.model';
import {
    Must,
    NotNull,
} from '../../../../common/validation/custom-validation/must-sync.rule';

export class TodolistRequest {
    @ApiProperty()
    @IsNotEmpty()
    @Must((x) => length(x, 6), NotNull, {
        message: 'listTitle length must be more than 3',
    })
    listTitle: string;
}

export class TodolistResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    listTitle: string;
    @ApiProperty()
    createdAt: string;
    @ApiProperty({ isArray: true })
    todos: [];
}
