import { validate } from 'class-validator';
import { ValidationError } from '../errors/error.class';
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
