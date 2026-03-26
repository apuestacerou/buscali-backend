import { Request, Response, NextFunction } from "express";
import { ValidationError, ConflictError, UnauthorizedError } from "../errors/error.class";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error("Error capturado:", err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Error de validación",
      errors: err.messages
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Conflicto en la operación",
      errors: err.messages
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "No autorizado",
      errors: err.messages
    });
  }

  return res.status(500).json({
    status: "error",
    code: 500,
    message: "Error interno del servidor",
    errors: [err.message || "Unexpected error"]
  });
}
