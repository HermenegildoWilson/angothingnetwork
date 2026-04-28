import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class userFields {
  @IsEmail({}, { message: 'O campo email deve ser um email válido.' })
  @IsNotEmpty({ message: 'O campo email é obrigatório.' })
  email!: string;

  @IsString({ message: 'O campo password deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo password é obrigatório.' })
  password!: string;
}
