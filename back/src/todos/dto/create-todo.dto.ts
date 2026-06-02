import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ maxLength: 255, example: 'Buy milk' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ maxLength: 2000, example: 'From the corner store' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
