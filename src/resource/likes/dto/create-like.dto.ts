import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateLikeDTO {
    @ApiProperty({ example: '1', description: 'post or comment id' })
    @IsNotEmpty()
    @IsNumber()
    postOrCommentId:number
}
