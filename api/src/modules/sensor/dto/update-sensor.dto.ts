import { PartialType } from '@nestjs/mapped-types';
import CreateSensorDto from './create-sensor.dto';

export default class UpdateSensorDto extends PartialType(CreateSensorDto) {}
