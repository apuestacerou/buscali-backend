import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { EmpresaModel } from './empresa-model';
@Table({
  tableName: 'ruta',
  timestamps: true,
  indexes: [
    {
      name: 'idx_rutas_coordenadas',
      using: 'gist',
      fields: ['coordenadas'],
    },
  ],
})
export class RutaModel extends Model {
  @Column({
    type: DataType.STRING,
    autoIncrement: false,
    primaryKey: true,
    unique: true,
    allowNull: false,
  })
  id_ruta!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  nombre_ruta!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  destino!: string;

  @Column({
    type: DataType.STRING,
  })
  descripcion!: string;

  @ForeignKey(() => EmpresaModel)
  @Column({
    type: DataType.STRING,
    autoIncrement: false,
    allowNull: false,
  })
  id_empresa!: string;

  @BelongsTo(() => EmpresaModel, { as: 'empresa' })
  empresa!: EmpresaModel;

  @Column({
    type: DataType.GEOMETRY('LINESTRING', 4326), // SRID para GPS
    allowNull: false,
  })
  coordenadas!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  colorhex!: string;
}
