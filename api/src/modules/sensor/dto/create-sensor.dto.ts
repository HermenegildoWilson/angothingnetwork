import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateSensorDto {
  @IsString({ message: 'O campo sensorCode deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo sensorCode é obrigatório.' })
  sensorCode!: string;
}
