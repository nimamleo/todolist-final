import { ApiProperty } from '@nestjs/swagger';
import {
    IsOptional,
    isString,
    IsString,
    length,
    Length,
} from 'class-validator';
import {
    Must,
    NotNull,
} from '../../../../common/validation/custom-validation/must-sync.rule';

export class UpdateTodoRequest {
    @ApiProperty({ required: false })
    @IsOptional()
    @Must((x) => isString(x), NotNull, { message: 'title must be string' })
    @Must((x) => length(x, 3), NotNull, {
        message: 'title length must be more than 3',
    })
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Must((x) => isString(x), NotNull, {
        message: 'description must be string',
    })
    @Must((x) => length(x, 3), NotNull, {
        message: 'description length must be more than 3',
    })
    description: string;
}
export class UpdateTodoResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    title?: string;
    @ApiProperty()
    description?: string;
    @ApiProperty()
    updatedAt: string;
}
