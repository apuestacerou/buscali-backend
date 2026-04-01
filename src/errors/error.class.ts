export class ValidationError extends Error {
  public readonly messages: string[];

  constructor(messages: string[] | string) {
    // Si es array, lo unimos con saltos de línea para el `message`
    super(Array.isArray(messages) ? messages.join('; ') : messages);

    this.name = 'ValidationError';
    // Guardamos siempre un array para poder devolverlo limpio en JSON
    this.messages = Array.isArray(messages) ? messages : [messages];
  }
}

export class ConflictError extends Error {
  public readonly messages: string[];
  constructor(messages: string[] | string) {
    super(Array.isArray(messages) ? messages.join('; ') : messages);
    this.name = 'ConflictError';
    this.messages = Array.isArray(messages) ? messages : [messages];
  }
}

export class UnauthorizedError extends Error {
  public readonly messages: string[];
  constructor(messages: string[] | string) {
    super(Array.isArray(messages) ? messages.join('; ') : messages);
    this.name = 'UnauthorizedError';
    this.messages = Array.isArray(messages) ? messages : [messages];
  }
}

//desacoplar
// ayuda para validar DTOs usando class-validator
import { validate } from 'class-validator';

export async function checkDto(dto: object): Promise<void> {
  //valida el DTO, si hay argumentos no permitidos lanza error
  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  // Si hay errores, extraemos los mensajes y lanzamos un ValidationError
  if (errors.length > 0) {
    const messages = extractMessages(errors);
    throw new ValidationError(messages);
  }
}

// función recursiva para extraer mensajes de error de validación, incluyendo errores anidados
function extractMessages(errors: any[]): string[] {
  const result: string[] = [];

  for (const err of errors) {
    if (err.constraints) {
      result.push(...(Object.values(err.constraints) as string[]));
    }
    if (err.children && err.children.length > 0) {
      result.push(...extractMessages(err.children));
    }
  }

  return result;
}
