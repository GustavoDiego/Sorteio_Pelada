import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  forca: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  velocidade: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  passe: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  chute: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  corpo: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  esperteza: number;
}
