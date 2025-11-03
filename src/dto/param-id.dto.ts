import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ParamIdDTO {
    @ApiProperty({ example: '5', description: 'id' })
    @IsNotEmpty()
    id: number;
}