import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class UpdateTodolistDto {
    @IsString()
    @Length(3, 20)
    @ApiProperty({required:false})
    listTitle: string;
}
