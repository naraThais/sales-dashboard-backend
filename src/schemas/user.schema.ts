import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(4, "Senha deve ter ao menos 4 caracteres"),
  role: z.enum(["user", "admin"]).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(4).optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
