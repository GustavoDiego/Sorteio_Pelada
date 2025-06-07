import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username só pode conter letras, números e underscores',
  })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
