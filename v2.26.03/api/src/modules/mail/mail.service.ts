import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { EnvService } from '@/config/env/env.service';
import DeviceDto from '../auth/dto/device.dto';

type ResendPayload = {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly env: EnvService) {}

  async sendTemplateEmail(params: {
    to: string;
    subject: string;
    template: string;
    context: Record<string, unknown>;
  }): Promise<unknown> {
    const { to, subject, context, template } = params;
    const html = this.renderTemplate(template, {
      ...context,
      subject,
      year: new Date().getFullYear(),
    });

    return this.sendResendEmail({
      from: this.env.resendFrom,
      to,
      subject,
      html,
    });
  }

  async sendUserConfirmation(params: {
    to: string;
    token: string;
  }): Promise<unknown> {
    const { to, token } = params;
    const url = `${this.env.appUrl}/signup/validate?token=${token}`;

    return this.sendTemplateEmail({
      to,
      subject: 'Validação de Conta Angothingnetwork',
      template: 'register-confirmation',
      context: {
        title: 'Confirme sua conta',
        message: 'Olá, clique no botão abaixo para validar sua conta.',
        url,
      },
    });
  }

  async sendSecurityAlert(params: {
    to: string;
    nome: string;
    deviceInfo: DeviceDto;
  }): Promise<unknown> {
    const { to, nome, deviceInfo } = params;
    const url = `${this.env.apiUrl}/user/devices`;

    return this.sendTemplateEmail({
      to,
      subject: `Alerta de segurança para ${to}`,
      template: 'security-alert',
      context: {
        title: 'Atividade de Login Detectada',
        message: `Detectamos um novo acesso à sua conta. Caso tenha sido você,
                  pode ignorar este email. Caso contrário, recomendamos que
                  verifique imediatamente os seus dispositivos ativos.`,
        url,
        nome,
        deviceInfo: {
          ...deviceInfo,
          date: new Date().toLocaleString('pt-PT'),
        },
      },
    });
  }

  async sendPasswordReset(params: {
    to: string;
    nome: string;
    token: string;
  }): Promise<unknown> {
    const { to, nome, token } = params;
    const url = `${this.env.apiUrl}/user/forgotpassword?token=${token}`;

    return this.sendTemplateEmail({
      to,
      subject: 'Reset de Senha Angothingnetwork',
      template: 'reset-password',
      context: {
        title: 'Redefinição de senha',
        message: `Olá ${nome}, clique no botão abaixo para redefinir sua senha.`,
        nome,
        url,
      },
    });
  }

  async sendSimpleEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<unknown> {
    return this.sendResendEmail({
      from: this.env.resendFrom,
      to,
      subject,
      text,
    });
  }

  private async sendResendEmail(payload: ResendPayload): Promise<unknown> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.env.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await (response.json() as Promise<unknown>).catch(
      () => null,
    );

    if (!response.ok) {
      this.logger.error(
        `Resend email failed: ${response.status} ${JSON.stringify(result)}`,
      );
      throw new InternalServerErrorException(
        'Não foi possível enviar o email.',
      );
    }

    return result;
  }

  private renderTemplate(template: string, context: Record<string, unknown>) {
    const templatePath = this.resolveTemplatePath(template);
    const source = readFileSync(templatePath, 'utf8');

    return source.replace(/{{\s*([\w.]+)\s*}}/g, (_, key: string) =>
      this.escapeHtml(this.resolveContextValue(context, key)),
    );
  }

  private resolveTemplatePath(template: string) {
    const relativePath = join('src/modules/mail/templates', `${template}.hbs`);
    const candidates = [
      join(process.cwd(), relativePath),
      join(__dirname, 'templates', `${template}.hbs`),
      join(__dirname, '..', 'templates', `${template}.hbs`),
    ];

    const templatePath = candidates.find((candidate) => existsSync(candidate));

    if (!templatePath) {
      throw new InternalServerErrorException(
        `Template de email não encontrado: ${template}`,
      );
    }

    return templatePath;
  }

  private resolveContextValue(context: Record<string, unknown>, key: string) {
    return key.split('.').reduce<unknown>((value, part) => {
      if (value && typeof value === 'object' && part in value) {
        return (value as Record<string, unknown>)[part];
      }
      return '';
    }, context);
  }

  private escapeHtml(value: unknown) {
    let text = '';

    if (typeof value === 'string') {
      text = value;
    } else if (
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'bigint'
    ) {
      text = value.toString();
    } else if (value instanceof Date) {
      text = value.toISOString();
    } else if (value !== null && value !== undefined) {
      text = JSON.stringify(value) ?? '';
    }

    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
