import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'conductores',
  timestamps: false, 
})
export class ConductorModel extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nombre!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  cedula!: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  telefono!: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;
}
