import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

export type RolUsuario = 'pasajero' | 'conductor' | 'administrador';

@Table({
  tableName: 'usuarios',
  timestamps: true,
  underscored: true,
})
export class Usuario extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(120),
    allowNull: false,
  })
  declare nombre: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare email: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare telefono: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare passwordHash: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'pasajero',
  })
  declare rol: RolUsuario;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
