// Interfaz para el usuario en la base de datos
export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  telefono?: string | null;
  fecha_registro: Date;
  reset_token?: string | null;
  reset_expires?: Date | null;
}
