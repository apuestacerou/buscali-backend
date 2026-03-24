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
    super(Array.isArray(messages) ? messages.join("; ") : messages);
    this.name = "UnauthorizedError";
    this.messages = Array.isArray(messages) ? messages : [messages];
  }
}


// ayuda para validar DTOs usando class-validator
import { validate } from 'class-validator';

export async function checkDto(dto: object): Promise<void> {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map(err => Object.values(err.constraints || {}))
      .flat();

    throw new ValidationError(messages);
  }
}


