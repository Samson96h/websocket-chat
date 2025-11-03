import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import { confidential } from "src/database/enums/confidetial.enum";


export class UpdateUserDTO {
    @ApiPropertyOptional({ example: 'John', description: 'user first name' })
    @IsOptional()
    @MinLength(2)
    @IsString()
    firstName?:string;

    @ApiPropertyOptional({ example: 'Doe', description: 'user last name' })
    @IsOptional()
    @MinLength(3)
    @IsString()
    lastName?:string;

    @ApiPropertyOptional({ example: 25, description: 'user age' })
    @IsOptional()
    @IsNumber()
    @Min(16)
    age?:number;

    @ApiPropertyOptional({ example: 'private', description: 'defoult:public' })
    @IsOptional()
    @IsEnum(confidential)
    confidentiality:confidential
}
