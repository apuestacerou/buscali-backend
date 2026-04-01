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
