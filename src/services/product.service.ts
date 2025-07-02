import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}): Promise<Product> {
  return prisma.product.create({
    data,
  });
}

export async function findProductById(id: number): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
  });
}

interface ListProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function listProducts(params: ListProductsParams = {}) {
  const { page = 1, pageSize = 10, search, minPrice, maxPrice } = params;

  const where: any = {};

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const products = await prisma.product.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  const totalCount = await prisma.product.count({ where });

  return {
    data: products,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function updateProduct(
  id: number,
  data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: number): Promise<Product> {
  return prisma.product.delete({
    where: { id },
  });
}
