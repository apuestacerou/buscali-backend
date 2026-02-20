// interfaz (interface): sólo para TypeScript en tiempo de compilación; describe la forma/contrato de datos; se elimina en el JavaScript final. Útil para DTOs, firmas de funciones y tipado estático.
export interface Conductor {
  id: number;
  nombre: string;
  cedula: bigint;
  email: string;
  telefono: bigint;
  password: string;
  created_at: Date;
}