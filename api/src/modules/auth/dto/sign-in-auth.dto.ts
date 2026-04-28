import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import deviceDto from './device.dto';
import userFields from './user-fields-auth.dto';

export default class SignInAuthDto {
  @IsDefined({ message: 'O campo userFields é obrigatório.' })
  @ValidateNested({ message: 'O campo userFields é inválido.' })
  @Type(() => userFields)
  userFields!: userFields;

  @IsDefined({ message: 'O campo deviceDto é obrigatório.' })
  @ValidateNested({ message: 'O campo deviceDto é inválido.' })
  @Type(() => deviceDto)
  deviceDto!: deviceDto;
}
