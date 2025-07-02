import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateParams =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Parâmetros inválidos", errors: err.errors });
      }
      return res
        .status(400)
        .json({ message: "Erro desconhecido na validação" });
    }
  };
