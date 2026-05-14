import { Response } from "express";

/**
 * Envía una respuesta exitosa en formato JSON.
 * Express formateará automáticamente el JSON con indentación para mejor legibilidad.
 * 
 * @param res - Objeto Response de Express
 * @param code - Código HTTP (default: 200)
 * @param message - Mensaje descriptivo de la operación
 * @param data - Datos adicionales a enviar en la respuesta (opcional)
 */
export function sendSuccess(
  res: Response,
  code = 200,
  message = "Operación exitosa",
  data?: any
) {
  return res.status(code).json({
    status: "success",
    code,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}
