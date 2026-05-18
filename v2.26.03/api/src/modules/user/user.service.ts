import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { Prisma, UserRole } from '@/generated/prisma/client';
import { randomBytes } from 'crypto';
import { TEN_MINUTES_IN_MS } from '@/common/utils/date';
import { MailService } from '../mail/mail.service';
import { EnvService } from '@/config/env/env.service';

const toDbTimestamp = (date: Date) =>
  // Stores local wall-clock time into TIMESTAMP WITHOUT TZ.
  // getTimezoneOffset = minutes to add to local to get UTC, so subtract to get local.
  new Date(date.getTime() - date.getTimezoneOffset() * 60000);

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly env: EnvService,
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

    const passwordHash = await this.hashPassword(password);
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
    const role: UserRole =
      data.email === this.env.adminEmail ? 'ADMIN' : 'VISITOR';

    const createdUser = await this.prisma.user.create({
      data: {
        ...data,
        role,
      },
      omit: {
        passwordHash: true,
      },
    });

    if (role === 'ADMIN') {
      await this.allocateAllSensorsToAdmin(createdUser.id);
    }

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

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }) {
    const { where, data } = params;

    // Impedir alteração de email e phone (campos readonly)
    if (data.email || data.phone) {
      throw new BadRequestException(
        'Email e telefone não podem ser alterados.',
      );
    }

    // Verificar unicidade do username se estiver a ser alterado
    if (data.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: data.username },
      });

      if (existingUser && existingUser.id !== where.id) {
        throw new ConflictException(
          'Username já está em uso por outro utilizador.',
        );
      }
    }

    // Atualizar utilizador
    return this.prisma.user.update({
      ...params,
      omit: { passwordHash: true },
    });
  }

  async updatePassword(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdatePasswordDto;
  }) {
    const { oldPassword, newPassword } = params.data;

    if (!newPassword) {
      throw new BadRequestException('A nova password é obrigatória.');
    }

    const user = await this.prisma.user.findUnique({ where: params.where });

    if (!user) {
      throw new NotFoundException('Utilizador não encontrado.');
    }

    if (oldPassword) {
      const isBcryptHash = /^\$2[aby]\$/.test(user.passwordHash);
      const oldPasswordIsValid = isBcryptHash
        ? await bcrypt.compare(oldPassword, user.passwordHash)
        : oldPassword === user.passwordHash;

      if (!oldPasswordIsValid) {
        throw new UnauthorizedException('Password atual inválida.');
      }
    }

    return this.prisma.user.update({
      where: params.where,
      data: { passwordHash: await this.hashPassword(newPassword) },
      omit: { passwordHash: true },
    });
  }

  generatePasswordResetToken(data: GeneratePasswordResetTokenDto) {
    if (!data.email) {
      throw new BadRequestException('O email é obrigatório.');
    }

    return {
      message:
        'Recuperação de password ainda não está ativa neste protótipo. Use login com uma conta de demonstração.',
    };
  }

  resetPassword(data: ResetPasswordDto) {
    if (!data.token) {
      throw new BadRequestException('O token é obrigatório.');
    }

    return {
      message:
        'Recuperação de password ainda não está ativa neste protótipo. Use login com uma conta de demonstração.',
    };
  }

  remove(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({ where });
  }

  async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private async allocateAllSensorsToAdmin(userId: string) {
    const sensors = await this.prisma.sensor.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });

    if (sensors.length === 0) {
      return { count: 0 };
    }

    return this.prisma.sensorAllocation.createMany({
      data: sensors.map((sensor) => ({
        sensorId: sensor.id,
        userId,
      })),
      skipDuplicates: true,
    });
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
