import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: { sub: string; role: string };
}
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token não enviado" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token mal formado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      role: string;
    };
    req.user = { sub: decoded.sub, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}
