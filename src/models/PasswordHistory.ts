/**
 * Modelo PasswordHistory para auditoría y prevención de reutilización
 * Registra cambios de contraseña para auditoría y seguridad
 */

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class PasswordHistory extends Model {
  public id!: number;
  public userId!: number;
  public passwordHash!: string;
  public changedAt!: Date;
}

PasswordHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID del usuario',
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Hash de la contraseña anterior',
    },
    changedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha del cambio',
    },
  },
  {
    sequelize,
    tableName: 'password_history',
    timestamps: false,
    indexes: [
      {
        fields: ['userId'],
        name: 'idx_password_history_userId',
      },
      {
        fields: ['changedAt'],
        name: 'idx_password_history_changedAt',
      },
    ],
  }
);

export default PasswordHistory;
