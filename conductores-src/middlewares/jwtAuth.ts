import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../shared/error.class";

//middleware jwt
export function jwtAuth(req: Request, res: Response, next: NextFunction) {
const token= req.cookies.access_token
req.auth = null;
if(!token){
  return next()
}
try {
  const data = jwt.verify(token, process.env.SECRET_JWT_KEY!);
  req.auth = data;
  return next();
} catch (err) {
  return next(new UnauthorizedError("Sesión inválida"));
}
}