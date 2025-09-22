import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
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
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
    message: 'Password precisa ter ao menos uma letra maiúscula, uma minúscula e um número',
  })
  password: string;
}
