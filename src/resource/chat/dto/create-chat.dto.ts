import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ChatType } from 'src/database/entities';

export class CreateChatDTO {
  @ApiProperty({ example: 'test-chatn', description: 'chat name' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ example: 'private', description: 'defoult:private' })
  @IsOptional()
  @IsEnum(ChatType, { message: 'Тип чата должен быть "private" или "group"' })
  type?: ChatType;
}
