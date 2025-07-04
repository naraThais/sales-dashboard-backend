import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middlewares/auth.middleware";
import productRoutes from "./routes/product.routes";
import userRoutes from "./routes/user.routes";
import { setupSwagger } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas públicas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);

// Rota protegida de exemplo
app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "Você acessou uma rota protegida",
    user: (req as any).user,
  });
});

// Rota base
app.get("/", (req, res) => {
  res.send("API Sales Dashboard rodando!");
});

// O CORS é habilitado globalmente logo após a criação do app:
app.use(cors());

setupSwagger(app);
console.log("Ambiente:", process.env.NODE_ENV || "development");

// Só roda o listen se NÃO estiver em teste
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log("Docs disponíveis em http://localhost:3000/api-docs");
  });
}

export default app;
