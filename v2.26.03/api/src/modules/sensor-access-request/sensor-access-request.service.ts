import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUserPayload } from '../auth/auth.jwt';
import { MailService } from '../mail/mail.service';

type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

@Injectable()
export class SensorAccessRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(user: AuthUserPayload, sensorId: string) {
    if (user.role === 'ADMIN') {
      throw new BadRequestException('Administradores já têm acesso aos sensores.');
    }

    const sensor = await this.prisma.sensor.findFirst({
      where: { id: sensorId, deletedAt: null },
    });

    if (!sensor) {
      throw new BadRequestException('Sensor inválido.');
    }

    const existingAllocation = await this.prisma.sensorAllocation.findFirst({
      where: { sensorId, userId: user.id, deletedAt: null },
    });

    if (existingAllocation) {
      throw new BadRequestException('Você já tem acesso a este sensor.');
    }

    const existingRequest = await (this.prisma as any).sensorAccessRequest
      .findUnique({
        where: { sensorId_userId: { sensorId, userId: user.id } },
        include: this.includeRelations(),
      });

    if (existingRequest?.status === 'PENDING') {
      return existingRequest;
    }

    if (existingRequest?.status === 'APPROVED') {
      throw new BadRequestException('Este pedido já foi aprovado.');
    }

    if (existingRequest?.status === 'REJECTED') {
      const request = await (this.prisma as any).sensorAccessRequest.update({
        where: { id: existingRequest.id },
        data: { status: 'PENDING', decidedAt: null },
        include: this.includeRelations(),
      });

      await this.notifyAdminsAboutAccessRequest(request);

      return request;
    }

    const request = await (this.prisma as any).sensorAccessRequest.create({
      data: { sensorId, userId: user.id },
      include: this.includeRelations(),
    });

    await this.notifyAdminsAboutAccessRequest(request);

    return request;
  }

  findForUser(user: AuthUserPayload, status?: RequestStatus) {
    this.validateStatus(status);

    if (user.role === 'ADMIN') {
      return (this.prisma as any).sensorAccessRequest.findMany({
        where: status ? { status } : undefined,
        include: this.includeRelations(),
        orderBy: { createdAt: 'desc' },
      });
    }

    return (this.prisma as any).sensorAccessRequest.findMany({
      where: {
        userId: user.id,
        ...(status ? { status } : {}),
      },
      include: this.includeRelations(),
      orderBy: { createdAt: 'desc' },
    });
  }

  private validateStatus(status?: string): asserts status is RequestStatus | undefined {
    if (!status) return;

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      throw new BadRequestException('Estado do pedido inválido.');
    }
  }

  async approve(id: string) {
    const request = await this.findPendingRequest(id);

    const approvedRequest = await this.prisma.$transaction(async (tx) => {
      const existingAllocation = await tx.sensorAllocation.findFirst({
        where: {
          sensorId: request.sensorId,
          userId: request.userId,
        },
      });

      if (existingAllocation) {
        await tx.sensorAllocation.update({
          where: { id: existingAllocation.id },
          data: { deletedAt: null },
        });
      } else {
        await tx.sensorAllocation.create({
          data: {
            sensorId: request.sensorId,
            userId: request.userId,
          },
        });
      }

      await tx.user.updateMany({
        where: { id: request.userId, role: 'VISITOR' },
        data: { role: 'CLIENT' },
      });

      return (tx as any).sensorAccessRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          decidedAt: new Date(),
        },
        include: this.includeRelations(),
      });
    });

    await this.notifyRequesterAboutApprovedRequest(approvedRequest);

    return approvedRequest;
  }

  async reject(id: string) {
    await this.findPendingRequest(id);

    const rejectedRequest = await (
      this.prisma as any
    ).sensorAccessRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        decidedAt: new Date(),
      },
      include: this.includeRelations(),
    });

    await this.notifyRequesterAboutRejectedRequest(rejectedRequest);

    return rejectedRequest;
  }

  private async findPendingRequest(id: string) {
    const request = await (this.prisma as any).sensorAccessRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Pedido de acesso não encontrado.');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Este pedido já foi analisado.');
    }

    return request;
  }

  private includeRelations() {
    return {
      sensor: { select: { id: true, sensorCode: true } },
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
        },
      },
    };
  }

  private async notifyAdminsAboutAccessRequest(request: {
    sensor: { sensorCode: string };
    user: { name: string; email: string };
  }) {
    const admins = await this.prisma.user.findMany({
      where: { role: 'ADMIN', deletedAt: null },
      select: { email: true },
    });

    const adminEmails = admins.map((admin) => admin.email);

    if (adminEmails.length === 0) {
      return;
    }

    await this.mailService.sendSensorAccessRequestAlert({
      to: adminEmails,
      requesterName: request.user.name,
      requesterEmail: request.user.email,
      sensorCode: request.sensor.sensorCode,
    });
  }

  private async notifyRequesterAboutApprovedRequest(request: {
    sensor: { sensorCode: string };
    user: { name: string; email: string };
  }) {
    await this.mailService.sendSensorAccessRequestApproved({
      to: request.user.email,
      nome: request.user.name,
      sensorCode: request.sensor.sensorCode,
    });
  }

  private async notifyRequesterAboutRejectedRequest(request: {
    sensor: { sensorCode: string };
    user: { name: string; email: string };
  }) {
    await this.mailService.sendSensorAccessRequestRejected({
      to: request.user.email,
      nome: request.user.name,
      sensorCode: request.sensor.sensorCode,
    });
  }
}
