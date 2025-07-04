import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  getProducts,
  createProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller";
import { validateParams } from "../middlewares/validateParams";
import { productSchema } from "../schemas/product.schema";
const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Lista produtos com paginação e filtros
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de produtos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo para busca por nome ou descrição
 *     responses:
 *       200:
 *         description: Lista paginada de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Produto Exemplo"
 *                       description:
 *                         type: string
 *                         example: "Descrição do produto"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 99.90
 *                       imageUrl:
 *                         type: string
 *                         nullable: true
 *                         example: "http://url-da-imagem.com/img.png"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-02T18:40:24.857Z"
 *                 totalCount:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Token não enviado ou inválido
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/", getProducts);
/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados para criar o produto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Novo Produto"
 *               description:
 *                 type: string
 *                 example: "Descrição do novo produto"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 123.45
 *               imageUrl:
 *                 type: string
 *                 nullable: true
 *                 example: "http://url-da-imagem.com/novo.png"
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 name:
 *                   type: string
 *                   example: "Novo Produto"
 *                 description:
 *                   type: string
 *                   example: "Descrição do novo produto"
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 123.45
 *                 imageUrl:
 *                   type: string
 *                   nullable: true
 *                   example: "http://url-da-imagem.com/novo.png"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-02T18:40:24.857Z"
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não enviado ou inválido
 *       500:
 *         description: Erro interno no servidor
 */
router.post(
  "/",
  authenticate,
  upload.single("image"),
  authorizeRoles("admin"),
  validateParams(productSchema),
  createProductController
);
/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto existente pelo ID
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser atualizado
 *         schema:
 *           type: integer
 *           example: 10
 *     requestBody:
 *       description: Dados para atualizar o produto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Produto Atualizado"
 *               description:
 *                 type: string
 *                 example: "Nova descrição"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 199.99
 *               imageUrl:
 *                 type: string
 *                 nullable: true
 *                 example: "http://url-da-imagem.com/atualizado.png"
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 name:
 *                   type: string
 *                   example: "Produto Atualizado"
 *                 description:
 *                   type: string
 *                   example: "Nova descrição"
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 199.99
 *                 imageUrl:
 *                   type: string
 *                   nullable: true
 *                   example: "http://url-da-imagem.com/atualizado.png"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-02T19:00:00.000Z"
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não enviado ou inválido
 *       403:
 *         description: Acesso negado — usuário não autorizado
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.put(
  "/:id",
  authenticate,
  upload.single("image"),
  authorizeRoles("admin"),
  updateProductController
);
/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Deleta um produto pelo ID
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser deletado
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso (sem conteúdo)
 *       401:
 *         description: Token não enviado ou inválido
 *       403:
 *         description: Acesso negado — usuário não autorizado
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteProductController
);

export default router;

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Retorna a lista de produtos
 *     tags:
 *       - Produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   imageUrl:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
