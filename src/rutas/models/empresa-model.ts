import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { HasMany } from 'sequelize-typescript';
import { RutaModel } from './ruta-model';
@Table({
  tableName: 'empresa',
  timestamps: true,
})
export class EmpresaModel extends Model {
  @HasMany(() => RutaModel, { as: 'rutas' })
  rutas!: RutaModel[];

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, // Usa UUIDv4 para generar un ID aleatorio
    primaryKey: true,
  })
  id_empresa!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nombre_empresa!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nit!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  telefono!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  correo!: string;
}
