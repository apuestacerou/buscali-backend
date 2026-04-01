import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'conductor',
  timestamps: false, 
})
export class ConductorModel extends Model {
  @Column({
    type: DataType.STRING,
    autoIncrement: false,
    primaryKey: true,
    unique: true,
    allowNull: false
  })
  cedula!:string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nombre!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  correo_electronico!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  telefono!:string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Conductor@123' // Contraseña por defecto para nuevos conductores
  })
  contrasena?: string;
  
  @Column({
    type: DataType.ENUM('Activo', 'Inactivo'),
    allowNull: false,
    defaultValue: 'Activo',
  })
  estado?: string;
  
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  fecha_creacion!: Date;

}
