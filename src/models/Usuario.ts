/**
 * Modelo Usuario - Representa la tabla "usuarios" en la base de datos.
 * Usamos sequelize-typescript: decoradores para definir columnas y tipo de dato.
 */

import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

// Tipo para los roles permitidos (evita escribir strings sueltos en el código)
export type RolUsuario = 'pasajero' | 'conductor' | 'administrador';

/**
 * @Table indica que esta clase es una tabla en la BD.
 * tableName: nombre real de la tabla en Postgres.
 * timestamps: true → Sequelize crea y actualiza createdAt y updatedAt.
 * underscored: true → en BD los nombres van con guión bajo (created_at, password_hash).
 */
@Table({
  tableName: 'usuarios',
  timestamps: true,
  underscored: true,
})
export class Usuario extends Model {
  /** ID numérico, autoincremental, clave primaria */
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  /** Nombre del usuario. Obligatorio, máximo 120 caracteres */
  @Column({
    type: DataType.STRING(120),
    allowNull: false,
  })
  declare nombre: string;

  /** Apellido del usuario. Obligatorio, máximo 120 caracteres */
  @Column({
    type: DataType.STRING(120),
    allowNull: false,
    defaultValue: '',
  })
  declare apellido: string;

  /** Email. Opcional (allowNull: true), máximo 255 caracteres */
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare email: string | null;

  /** Teléfono. Opcional, máximo 20 caracteres */
  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare telefono: string | null;

  /** Contraseña hasheada (nunca guardamos la contraseña en texto plano). Obligatoria */
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare passwordHash: string;

  /** Rol: pasajero, conductor o administrador. Por defecto "pasajero" */
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'pasajero',
  })
  declare rol: RolUsuario;

  /** Fecha de creación del registro. La rellena Sequelize al hacer create() */
  @CreatedAt
  declare createdAt: Date;

  /** Fecha de última actualización. La actualiza Sequelize al hacer save() */
  @UpdatedAt
  declare updatedAt: Date;
}
