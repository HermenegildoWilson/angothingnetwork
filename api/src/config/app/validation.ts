import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

const getFirstValidationMessage = (errors: ValidationError[]) => {
  const stack: ValidationError[] = [...errors];
  while (stack.length > 0) {
    const error = stack.shift();
    if (!error) continue;
    if (error.constraints) {
      const messages = Object.values(error.constraints);
      if (messages.length > 0) return messages[0];
    }
    if (Array.isArray(error.children) && error.children.length > 0) {
      stack.unshift(...error.children);
    }
  }
  return 'Dados inválidos.';
};

export const buildValidationPipe = () =>
  new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors) => {
      const message = getFirstValidationMessage(errors);
      return new BadRequestException({
        message: [message],
        error: 'Bad Request',
        statusCode: 400,
      });
    },
  });
