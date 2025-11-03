import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,IsString, MinLength } from "class-validator";

export class CreatePostDTO {
    @ApiProperty({ example: 'This is a post description', description: 'post description' })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    description: string
}
