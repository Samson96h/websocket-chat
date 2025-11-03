import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';


export class CodeDTO {
  @ApiProperty({ example: '548965', description: 'secret code' })
  @IsString()
  @Length(6, 6)
  code: string;
}