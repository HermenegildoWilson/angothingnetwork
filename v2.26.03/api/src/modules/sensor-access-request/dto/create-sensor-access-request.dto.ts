import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateSensorAccessRequestDto {
  @IsString({ message: 'O campo sensorId deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo sensorId é obrigatório.' })
  sensorId!: string;
}
