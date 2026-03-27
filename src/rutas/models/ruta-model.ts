import { Table, Column, Model, DataType } from 'sequelize-typescript';
@Table({
  tableName: 'ruta',
  timestamps: false,
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

  // @Column({
  //   type: DataType.STRING,
  //   autoIncrement: false,
  //   allowNull: false,
  // })
  // id_empresa!: string;

  @Column({
    type: DataType.GEOMETRY('LINESTRING', 4326), // SRID para GPS
    allowNull: false,
  })
  coordenadas!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  colorHex!: string;
}
// asociación con llave foranea ejemplo
// empresa_transporte.hasMany(ruta, { foreignKey: "id_empresa" });
// ruta.belongsTo(empresa_transporte, { foreignKey: "id_ruta" });
