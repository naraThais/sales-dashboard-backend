import dotenv from "dotenv";
dotenv.config();

import jwt, { SignOptions } from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../services/user.service";

// Garante que a variável existe em tempo de execução
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no .env");
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao fazer login" });
  }
}

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, password, role);

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao registrar usuário" });
  }
}
