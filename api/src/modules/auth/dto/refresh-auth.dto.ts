import { IsNotEmpty, IsString } from 'class-validator';

export default class RefreshAuthDto {
  @IsString({ message: 'O campo refreshToken deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo refreshToken é obrigatório.' })
  refreshToken!: string;
}
