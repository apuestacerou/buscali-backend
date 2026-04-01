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
    type: DataType.STRING,
    autoIncrement: false,
    primaryKey: true,
    unique: true,
    allowNull: false,
  })
  id_empresa!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nombre!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nit!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  telefono!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  correo!: string;
}
