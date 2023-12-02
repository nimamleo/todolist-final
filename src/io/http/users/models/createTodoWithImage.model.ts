import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, length } from 'class-validator';
import {
    Must,
    NotNull,
} from '../../../../common/validation/custom-validation/must-sync.rule';
import { IFile } from '../../../../model/file.model';

export class CreateTodoWithImageRequest {
    @ApiProperty()
    @IsNotEmpty()
    @Must((x) => length(x, 6), NotNull, {
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

export class CreateTodoWithImageResponse {
    @ApiProperty()
    todoId: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    imageId: string;

    @ApiProperty()
    size: number;

    @ApiProperty()
    filePath: string;

    @ApiProperty()
    mimetype: string;

    @ApiProperty()
    createdAt: string;
}
