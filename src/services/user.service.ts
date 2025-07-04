import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: string
) {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
    },
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function listUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function deleteUserById(id: string) {
  return prisma.user.delete({ where: { id } });
}
