import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDto, {
  GenerateRegisterTokenDto,
  ClearRegisterTokenTokenDto,
} from './dto/create-user.dto';
import UpdateUserDto, {
  GeneratePasswordResetTokenDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from './dto/update-user.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Public()
  generateRegisterToken(@Body() data: GenerateRegisterTokenDto) {
    return this.userService.generateRegisterToken(data);
  }

  @Post('clearregistertoken')
  @Public()
  clearRegisterToken(@Body() data: ClearRegisterTokenTokenDto) {
    return this.userService.clearRegisterToken(data);
  }

  @Post()
  @Public()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  findAll() {
    return this.userService.findAll({
      omit: {
        passwordHash: true,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({
      where: { id },
      omit: {
        passwordHash: true,
      },
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update({ where: { id }, data });
  }

  @Patch('password/:id')
  updatePassword(@Body() data: UpdatePasswordDto, @Param('id') id: string) {
    return this.userService.updatePassword({
      where: { id },
      data,
    });
  }

  @Post('forgotpassword')
  @Public()
  generatePasswordResetToken(@Body() data: GeneratePasswordResetTokenDto) {
    return this.userService.generatePasswordResetToken(data);
  }

  @Patch('resetpassword')
  @Public()
  ResetPasswordDto(@Body() data: ResetPasswordDto) {
    return this.userService.resetPassword(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove({ id });
  }
}
