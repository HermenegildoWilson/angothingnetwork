import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export default class CreateUserDto {
  @IsString({ message: 'O campo token deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo token é obrigatório.' })
  token!: string;
}

export class GenerateRegisterTokenDto {
  @IsString({ message: 'O campo name deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo name é obrigatório.' })
  name!: string;

  @IsEmail({}, { message: 'O campo email deve ser um email válido.' })
  @IsNotEmpty({ message: 'O campo email é obrigatório.' })
  email!: string;

  @IsString({ message: 'O campo phone deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo phone é obrigatório.' })
  phone!: string;

  @IsString({ message: 'O campo password deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo password é obrigatório.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
    message:
      'A password deve ter pelo menos 8 caracteres e incluir letras e números.',
  })
  password!: string;
}

export class ClearRegisterTokenTokenDto {
  @IsEmail({}, { message: 'O campo email deve ser um email válido.' })
  @IsNotEmpty({ message: 'O campo email é obrigatório.' })
  email!: string;
}
