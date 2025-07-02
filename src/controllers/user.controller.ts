import { Request, Response } from "express";
import { listUsers } from "../services/user.service";

import { deleteUserById } from "../services/user.service";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
}

export async function deleteUserController(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await deleteUserById(id);
    return res.status(204).send(); // Sem conteúdo
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({ message: "Erro ao deletar usuário" });
  }
}
