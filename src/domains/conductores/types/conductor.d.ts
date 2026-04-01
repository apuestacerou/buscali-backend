// interfaz (interface): sólo para TypeScript en tiempo de compilación; describe la forma/contrato de datos; se elimina en el JavaScript final. Útil para DTOs, firmas de funciones y tipado estático.
export interface Conductor {
  //para el conductor su llave primaria es la cedula
  cedula: string;
  nombre: string;
  correo_electronico: string;
  telefono: string;
  contrasena: string;
  fecha_creacion: Date;
  estado: string; // campo opcional para indicar el estado del conductor (activo, inactivo, etc.)
}