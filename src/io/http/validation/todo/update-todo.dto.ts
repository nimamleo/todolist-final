import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateTodoDto {
    @IsString()
    @Length(3, 20)
    @ApiProperty({ required: false })
    title: string;

    @IsString()
    @Length(3, 20)
    @ApiProperty({ required: false })
    description: string;
}
