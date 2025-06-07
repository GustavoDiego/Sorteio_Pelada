import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  nome: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  forca: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  velocidade: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  passe: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  chute: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  corpo: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  esperteza: number;
}
