import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EnvService } from '@/config/env/env.service';
import DeviceDto from '../auth/dto/device.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly env: EnvService,
  ) {}

  /**
   * Função base reutilizável para envio com template
   */
  async sendTemplateEmail(params: {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
  }): Promise<any> {
    const { to, subject, context, template } = params;

    return this.mailerService.sendMail({
      to,
      subject,
      template,
      context: {
        ...context,
        subject,
        year: new Date().getFullYear(),
      },
    });
  }

  /**
   * Confirmação de conta
   */
  async sendUserConfirmation(params: {
    to: string;
    token: string;
  }): Promise<any> {
    const { to, token } = params;

    const url = `${this.env.appUrl}/signup/validate?token=${token}`;

    return this.sendTemplateEmail({
      to,
      subject: 'Validação de Conta Angothingnetwork',
      template: 'register-confirmation',
      context: {
        title: 'Confirme sua conta',
        message: `Olá, clique no botão abaixo para validar sua conta.`,
        url,
      },
    });
  }

  /**
   * Confirmação de conta
   */
  async sendSecurityAlert(params: {
    to: string;
    nome: string;
    deviceInfo: DeviceDto;
  }): Promise<any> {
    const { to, nome, deviceInfo } = params;

    const url = `${this.env.apiUrl}/user/devices`;

    return this.sendTemplateEmail({
      to,
      subject: `Alerta de segurança para ${to}`,
      template: 'security-alert',
      context: {
        title: '⚠️ Atividade de Login Detectada',
        message: `Detectamos um novo acesso à sua conta. Caso tenha sido você,
                  pode ignorar este email. Caso contrário, recomendamos que
                  verifique imediatamente os seus dispositivos ativos.`,
        url,
        nome,
        year: new Date().getFullYear(),
        deviceInfo: {
          ...deviceInfo,
          date: new Date().toLocaleString('pt-PT'),
        },
      },
    });
  }

  /**
   * Reset de senha
   */
  async sendPasswordReset(params: {
    to: string;
    nome: string;
    token: string;
  }): Promise<any> {
    const { to, nome, token } = params;
    const url = `${this.env.apiUrl}/user/forgotpassword?token=${token}`;

    return this.sendTemplateEmail({
      to,
      subject: 'Reset de Senha Angothingnetwork',
      template: 'reset-password',
      context: {
        title: 'Redefinição de senha',
        message: `Olá ${nome}, clique no botão abaixo para redefinir sua senha.`,
        url,
      },
    });
  }

  /**
   * Email simples (sem template)
   */
  async sendSimpleEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<any> {
    return this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }
}
