import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class deviceDto {
  @IsString({ message: 'O campo deviceId deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo deviceId é obrigatório.' })
  deviceId!: string;

  @IsString({ message: 'O campo userAgent deve ser uma string.' })
  @IsOptional()
  userAgent?: string;

  @IsString({ message: 'O campo platform deve ser uma string.' })
  @IsOptional()
  platform?: string;

  @IsString({ message: 'O campo os deve ser uma string.' })
  @IsOptional()
  os?: string;

  @IsString({ message: 'O campo browser deve ser uma string.' })
  @IsOptional()
  browser?: string;

  @IsString({ message: 'O campo ipAddress deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo ipAddress é obrigatório.' })
  ipAddress!: string;

  @IsString({ message: 'O campo brand deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo brand é obrigatório.' })
  brand!: string;

  @IsString({ message: 'O campo model deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo model é obrigatório.' })
  model!: string;

  @IsString({ message: 'O campo osVersion deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo osVersion é obrigatório.' })
  osVersion!: string;

  @IsString({ message: 'O campo appVersion deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo appVersion é obrigatório.' })
  appVersion!: string;

  @IsString({ message: 'O campo country deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo country é obrigatório.' })
  country!: string;

  @IsString({ message: 'O campo city deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo city é obrigatório.' })
  city!: string;
}
