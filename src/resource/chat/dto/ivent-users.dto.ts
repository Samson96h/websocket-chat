import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class IventUsersDTO {
    @ApiProperty({ example: '1', description: 'chat id' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    chatId: number;

    @ApiProperty({ example: '2', description: 'user id' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    userId: number;
}