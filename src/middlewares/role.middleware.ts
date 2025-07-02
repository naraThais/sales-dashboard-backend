import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    next();
  };
}
