import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";
import { confidential } from "src/database/enums/confidetial.enum";


export class CreateAuthDTO {
    @ApiProperty({ example: '+37477986589', description: 'user phone' })
    @IsPhoneNumber()
    phone: string;
    
    @ApiProperty({ example: 'John', description: 'user name' })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    firstName: string;

    @ApiPropertyOptional({ example: 'public', description: 'defoult:public' })
    @IsOptional()
    @IsEnum(confidential)
    confidentiality: confidential
}
