import { Request, Response } from "express";
import {
  listProducts,
  createProduct,
  findProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service";

export async function getProducts(req: Request, res: Response) {
  try {
    const { page, pageSize, search, minPrice, maxPrice } = req.query;

    const result = await listProducts({
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar produtos", error });
  }
}

export async function createProductController(req: Request, res: Response) {
  try {
    const { name, description, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const product = await createProduct({
      name,
      description,
      price: Number(price),
      imageUrl,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar produto", error });
  }
}

export async function updateProductController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { name, description, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const data = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
      ...(imageUrl && { imageUrl }),
    };

    const product = await updateProduct(id, data);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar produto", error });
  }
}

export async function deleteProductController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await deleteProduct(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar produto", error });
  }
}
