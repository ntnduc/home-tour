import { IsOptional, IsString } from 'class-validator';

export class TestContentCreateDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;
}
