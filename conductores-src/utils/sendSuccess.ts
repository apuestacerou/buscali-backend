import { Response } from "express";

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
    data
  });
}
