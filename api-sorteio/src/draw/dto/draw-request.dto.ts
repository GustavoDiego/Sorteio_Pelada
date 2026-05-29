import { Type } from 'class-transformer';
import {
    IsArray,
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

export class DrawPlayerDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    _id?: string;

    @IsString()
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

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsDateString()
    createdAt?: string;

    @IsOptional()
    @IsDateString()
    updatedAt?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    __v?: number;
}

export class DrawRequestDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DrawPlayerDto)
    jogadores: DrawPlayerDto[];

    @Type(() => Number)
    @IsInt()
    @Min(1)
    numeroDeTimes: number;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    tamanhoPorTime: number;
}
