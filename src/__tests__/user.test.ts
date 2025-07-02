import request from "supertest";
import app from "../server";

describe("Controle de permissão entre usuários", () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;

  beforeAll(async () => {
    console.log("==> Registrando usuário normal...");
    await request(app).post("/api/auth/register").send({
      name: "User Test",
      email: "user1@example.com",
      password: "123",
      role: "user",
    });

    console.log("==> Registrando usuário admin...");
    await request(app).post("/api/auth/register").send({
      name: "Admin Test",
      email: "admin@exemplo.com",
      password: "123",
      role: "admin",
    });

    console.log("==> Fazendo login do usuário normal...");
    const userLoginRes = await request(app).post("/api/auth/login").send({
      email: "user1@example.com",
      password: "123",
    });
    userToken = userLoginRes.body.token;
    console.log("Token do usuário normal:", userToken);

    console.log("==> Fazendo login do admin...");
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      email: "admin@exemplo.com",
      password: "123",
    });
    adminToken = adminLoginRes.body.token;
    console.log("Token do admin:", adminToken);

    console.log("==> Buscando lista de usuários...");
    const listRes = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Resposta da lista:", listRes.body);

    const users = Array.isArray(listRes.body)
      ? listRes.body
      : listRes.body.data;

    userId = users.find((u: any) => u.email === "user1@example.com")?.id;
    adminId = users.find((u: any) => u.email === "admin@exemplo.com")?.id;

    console.log("ID do usuário:", userId);
    console.log("ID do admin:", adminId);

    if (!userId || !adminId) {
      throw new Error("Usuário ou Admin não encontrado na lista");
    }
  });

  it("OK Admin deve conseguir deletar o usuário comum", async () => {
    console.log("Admin vai deletar usuário comum com ID:", userId);
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Resposta delete usuário comum:", res.statusCode, res.body);

    expect(res.statusCode).toBe(204);
  });

  it("X Usuário comum não deve conseguir deletar admin", async () => {
    console.log("Usuário comum vai tentar deletar admin com ID:", adminId);
    const res = await request(app)
      .delete(`/api/users/${adminId}`)
      .set("Authorization", `Bearer ${userToken}`);

    console.log("Resposta tentativa delete admin:", res.statusCode, res.body);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Acesso negado");
  });
});
