import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'usuario',
  timestamps: false,
})
export class UsuarioModel extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    allowNull: false,
  })
  id_usuario!: number;

  @Column({
    type: DataType.STRING(60),
    allowNull: false,
  })
  nombre!: string;

  @Column({
    type: DataType.STRING(60),
    allowNull: false,
  })
  apellido!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  correo!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    unique: true,
  })
  telefono?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  fecha_registro!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reset_token?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  reset_expires?: Date;
}
