import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { deleteUserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateParams } from "../middlewares/validateParams";
import { userIdParamSchema } from "../schemas/user.schema";

const router = Router();
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Retorna a lista de usuários
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "81498f47-bc44-4237-917d-21e242f89fbc"
 *                   name:
 *                     type: string
 *                     example: "Thais"
 *                   email:
 *                     type: string
 *                     example: "thaisnara@gmail.com"
 *                   role:
 *                     type: string
 *                     example: "user"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-02T18:40:24.857Z"
 *       401:
 *         description: Token não enviado ou inválido
 *       500:
 *         description: Erro ao buscar usuários
 */
router.get("/", authenticate, getUsers);
/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID (apenas admin autorizado)
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser deletado
 *         schema:
 *           type: string
 *           example: "81498f47-bc44-4237-917d-21e242f89fbc"
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso (sem conteúdo)
 *       401:
 *         description: Token não enviado ou inválido
 *       403:
 *         description: Acesso negado — usuário não é admin
 *       500:
 *         description: Erro ao deletar usuário
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validateParams(userIdParamSchema),
  deleteUserController
);

export default router;
