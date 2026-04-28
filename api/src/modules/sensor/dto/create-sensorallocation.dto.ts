import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateSensorAllocationDto {
  @IsString({ message: 'O campo sensorId deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo sensorId é obrigatório.' })
  sensorId!: string;

  @IsString({ message: 'O campo userId deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo userId é obrigatório.' })
  userId!: string;
}
