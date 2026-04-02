import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreateSensorReadingDto {
  @IsString({ message: 'O campo sensorCode deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo sensorCode é obrigatório.' })
  sensorCode!: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'O campo temperature deve ser um número.' })
  temperature!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'O campo humidity deve ser um número.' })
  humidity!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'O campo pressure deve ser um número.' })
  pressure!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'O campo air_quality deve ser um número.' })
  air_quality!: number;

  @IsDate()
  @IsOptional()
  timestamp?: Date;
}
