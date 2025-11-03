import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateCommentDTO {
    @ApiProperty({ example: 'This is a comment', description: 'comment text' })
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    text:string

    @ApiProperty({ example: '1', description: 'post id' })
    @IsNotEmpty()
    @IsNumber()
    postId: number
}
