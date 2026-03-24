import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) {
    return res.status(401).json({
      status: "error",
      message: "Debe iniciar sesión"
    });
  }
  next();
}
