import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, length } from 'class-validator';
import {
    Must,
    NotNull,
} from '../../../../common/validation/custom-validation/must-sync.rule';

export class CreateTodoRequest {
    @ApiProperty()
    @IsNotEmpty()
    @Must((x) => length(x, 3), NotNull, {
        message: 'title length must be more than 3',
    })
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @Must((x) => length(x, 6), NotNull, {
        message: 'description length must be more than 6',
    })
    description: string;
}
export class CreateTodoResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: string;
}
