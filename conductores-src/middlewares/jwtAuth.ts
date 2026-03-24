import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//middleware jwt
export function jwtAuth(req: Request, res: Response, next: NextFunction) {
const token= req.cookies.access_token
req.auth = null;
try {
  const data = jwt.verify(token, process.env.SECRET_JWT_KEY!)
  req.auth = data
}catch (err) {
}
next() //seguir a la siguiente ruta o middleware
}