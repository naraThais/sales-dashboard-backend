import request from "supertest";
import app from "../server";

describe("Product API", () => {
  let token: string;
  let createdProductId: number;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@exemplo.com", password: "123" });

    token = res.body.token;
  });

  it("Deve criar um produto novo", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Produto Teste Jest",
        description: "Descrição do produto teste",
        price: 42.5,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Produto Teste Jest");
    createdProductId = res.body.id;
  });

  it("Deve listar produtos (GET /api/products)", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    // Se sua resposta retorna array direto
    const productsResponse = res.body;
    const products = productsResponse.data;

    console.log("Produtos retornados:", products);

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThanOrEqual(1);

    // Opcional: verifica se o produto criado está na lista
    expect(products.some((p: any) => p.id === createdProductId)).toBe(true);
  });

  it("Deve deletar o produto", async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
