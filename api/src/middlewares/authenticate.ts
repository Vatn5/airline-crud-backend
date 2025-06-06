import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env['JWT_SECRET'] || "unaClaveUltraSecretaDeberíaEstarEnEnv";

export interface AuthenticatedRequest extends Request {
  user?: any; // Puedes tipar el usuario según tu payload de JWT
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token no provisto" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload; // Guarda info útil en la request
    return next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido o expirado" });
    return;
  }
}
