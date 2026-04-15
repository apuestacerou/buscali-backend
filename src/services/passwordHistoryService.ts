/**
 * Servicio para gestionar historial de cambios de contraseña
 * Auditoría y prevención de reutilización
 */

import PasswordHistory from '../models/PasswordHistory';
import bcrypt from 'bcrypt';

/**
 * Guarda la contraseña anterior en el historial
 * @param userId - ID del usuario
 * @param passwordHash - Hash de la contraseña anterior
 */
export async function savePasswordHistory(userId: number, passwordHash: string): Promise<void> {
  try {
    await PasswordHistory.create({
      userId,
      passwordHash,
      changedAt: new Date(),
    });
  } catch (error) {
    console.error('Error al guardar historial de contraseña:', error);
    // No lanzar error, solo loguear para no romper el flujo
  }
}

/**
 * Obtiene el historial de cambios de contraseña
 * @param userId - ID del usuario
 * @param limit - Número máximo de registros (default: 10)
 */
export async function getPasswordHistory(userId: number, limit: number = 10) {
  try {
    const history = await PasswordHistory.findAll({
      where: { userId },
      order: [['changedAt', 'DESC']],
      limit,
      attributes: ['id', 'changedAt'],
    });
    return history;
  } catch (error) {
    console.error('Error al obtener historial de contraseña:', error);
    return [];
  }
}

/**
 * Verifica si la nueva contraseña ya fue usada antes
 * Previene reutilización de contraseñas recientes
 * @param userId - ID del usuario
 * @param newPassword - Nueva contraseña en texto plano
 * @param maxHistoryCheck - Número de contraseñas anteriores a verificar (default: 5)
 */
export async function checkPasswordHistoryUsage(
  userId: number,
  newPassword: string,
  maxHistoryCheck: number = 5
): Promise<boolean> {
  try {
    const recentHistory = await PasswordHistory.findAll({
      where: { userId },
      order: [['changedAt', 'DESC']],
      limit: maxHistoryCheck,
      attributes: ['passwordHash'],
    });

    // Verificar si alguna contraseña anterior coincide
    for (const record of recentHistory) {
      const matches = await bcrypt.compare(newPassword, record.passwordHash);
      if (matches) {
        return true; // La contraseña ya fue usada
      }
    }
    return false; // No fue usada
  } catch (error) {
    console.error('Error al verificar historial de contraseña:', error);
    return false;
  }
}

/**
 * Limpia el historial antiguo de un usuario
 * Mantiene solo los últimos N registros
 * @param userId - ID del usuario
 * @param keepRecords - Número de registros a mantener (default: 10)
 */
export async function cleanOldPasswordHistory(userId: number, keepRecords: number = 10): Promise<void> {
  try {
    const allRecords = await PasswordHistory.findAll({
      where: { userId },
      order: [['changedAt', 'DESC']],
    });

    if (allRecords.length > keepRecords) {
      const toDelete = allRecords.slice(keepRecords);
      const idsToDelete = toDelete.map((r) => r.id);

      await PasswordHistory.destroy({
        where: { id: idsToDelete },
      });
    }
  } catch (error) {
    console.error('Error al limpiar historial de contraseña:', error);
  }
}
