import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import CreateUserDto, {
  ClearRegisterTokenTokenDto,
  GenerateRegisterTokenDto,
} from './dto/create-user.dto';
import UpdateUserDto, {
  GeneratePasswordResetTokenDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { randomBytes } from 'crypto';
import { TEN_MINUTES_IN_MS } from '@/common/utils/date';
import { MailService } from '../mail/mail.service';

const toDbTimestamp = (date: Date) =>
  // Stores local wall-clock time into TIMESTAMP WITHOUT TZ.
  // getTimezoneOffset = minutes to add to local to get UTC, so subtract to get local.
  new Date(date.getTime() - date.getTimezoneOffset() * 60000);

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async generateRegisterToken(
    generateRegisterTokenDto: GenerateRegisterTokenDto,
  ) {
    const { password, ...data } = generateRegisterTokenDto;
    // Não aguardar a limpeza para não bloquear a resposta ao usuário
    await this.cleanExpiredTokens();

    const userEmailAllreadyExist = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    const pendingUserEmailAllreadyExist =
      await this.prisma.pendingUser.findUnique({
        where: { email: data.email },
      });
    if (userEmailAllreadyExist || pendingUserEmailAllreadyExist) {
      throw new ConflictException(
        'Por favor faça login, ou use um email diferente.',
      );
    }

    const userPhoneAllreadyExist = await this.prisma.user.findUnique({
      where: { phone: data.phone },
    });
    const pendingUserPhoneAllreadyExist =
      await this.prisma.pendingUser.findUnique({
        where: { phone: data.phone },
      });
    if (userPhoneAllreadyExist || pendingUserPhoneAllreadyExist) {
      throw new ConflictException(
        'Por favor faça login, ou use um telefone diferente.',
      );
    }

    const existingToken = await this.prisma.pendingUser.findFirst({
      where: {
        email: data.email,
        expiresAt: { gt: toDbTimestamp(new Date()) },
        used: false,
      },
    });

    if (existingToken) {
      throw new ConflictException(
        'A registration token has already been sent to this student. Please check your email or wait for the token to expire.',
      );
    }
    const token = randomBytes(32).toString('hex');

    await this.mailService.sendUserConfirmation({
      to: data.email,
      token,
    });
    console.log('Email sent...');

    const passwordHash = password; // Gerar hash
    const username = await this.generateUsername(data.name);
    const expiresAt = toDbTimestamp(new Date(Date.now() + TEN_MINUTES_IN_MS));

    await this.prisma.pendingUser.create({
      data: {
        ...data,
        expiresAt,
        token,
        username,
        passwordHash,
      },
    });
    return {
      message: `We sent an email with instructions on how to create your account. ${this.maskEmail(data.email)}.`,
    };
  }

  clearRegisterToken(clearRegisterTokenTokenDto: ClearRegisterTokenTokenDto) {
    const { email } = clearRegisterTokenTokenDto;
    return this.prisma.pendingUser.update({
      where: { email },
      data: { used: true },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { token } = createUserDto;

    const pendingUser = await this.prisma.pendingUser.findUnique({
      where: { token },
    });

    if (
      !pendingUser ||
      pendingUser.expiresAt < new Date() ||
      pendingUser.used
    ) {
      throw new BadRequestException('Chave de registro invalida ou expirada.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token: lol, createdAt, expiresAt, used, ...data } = pendingUser;

    const createdUser = await this.prisma.user.create({
      data,
      omit: {
        passwordHash: true,
      },
    });

    await this.prisma.pendingUser.deleteMany({
      where: { token },
    });

    return createdUser;
  }

  async findAll(args?: Prisma.UserFindManyArgs) {
    return await this.prisma.user.findMany(args);
  }

  findOne(args: Prisma.UserFindUniqueArgs) {
    return this.prisma.user.findUnique(args);
  }

  update(params: { where: Prisma.UserWhereUniqueInput; data: UpdateUserDto }) {
    return this.prisma.user.update({ ...params, omit: { passwordHash: true } });
  }

  updatePassword(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdatePasswordDto;
  }) {
    return this.prisma.user.update(params);
  }

  generatePasswordResetToken(data: GeneratePasswordResetTokenDto) {
    console.log(data);
  }

  resetPassword(data: ResetPasswordDto) {
    console.log(data);
  }

  remove(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({ where });
  }

  async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private async generateUsername(name: string): Promise<string> {
    const base = name
      .toLowerCase()
      .replace(/\s+/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    let username = base;
    let count = 1;

    while (await this.prisma.user.findUnique({ where: { username } })) {
      username = `${base}${count}`;
      count++;
    }

    return username;
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2)
      return '*'.repeat(localPart.length) + '@' + domain;

    const first = localPart.slice(0, 3); // primeiros 3 caracteres
    const last = localPart.slice(-1); // último caracter
    const masked = first + '*'.repeat(localPart.length - 4) + last;
    return masked + '@' + domain;
  }

  /** Limpa tokens expirados */
  private async cleanExpiredTokens() {
    await this.prisma.pendingUser.deleteMany({
      where: { expiresAt: { lt: toDbTimestamp(new Date()) }, used: false },
    });
  }
}
