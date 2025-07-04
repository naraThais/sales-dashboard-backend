# Sales Dashboard API

API RESTful desenvolvida com **Node.js + Express + TypeScript**, com autenticação JWT, controle de permissões por função (admin/user), testes automatizados com Jest, upload de arquivos e documentação com Swagger.

---

## Funcionalidades

- CRUD de usuários (admin e comuns)
- CRUD de produtos
- Autenticação com JWT
- Middleware de autenticação e autorização (por roles)
- Testes automatizados com Jest e Supertest
- Upload local de imagens de produtos
- Documentação interativa com Swagger
- Validações com Zod
- Exportação para CSV (opcional)
- Deploy-ready (Render/Heroku)

---

## Tecnologias

- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Zod (validação)
- JWT (autenticação)
- Multer (upload)
- Jest + Supertest (testes)
- Swagger (documentação)

---

## 🛠 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sales-dashboard-backend.git
cd sales-dashboard-backend

# Instale as dependências
npm install

# Configure o banco e .env
npx prisma migrate dev
