# WebMec Backend

Backend Express + TypeScript para gestão de mecânicos, clientes, pedidos e avaliações.

## Stack

- **Express 5** + **TypeScript**
- **PostgreSQL 16** (Docker)
- **Prisma ORM** (migrations + seed)

## Entidades

| Entidade        | Descrição                                      |
|-----------------|------------------------------------------------|
| User            | Usuários do sistema (admin, cliente, mecânico) |
| Cliente         | Clientes que solicitam serviços                |
| Mecânico        | Profissionais que executam os serviços         |
| Pedido          | Ordens de serviço                              |
| Avaliação       | Notas e comentários dos clientes               |
| Serviço         | Catálogo de serviços oferecidos                |
| Tarefa Semanal  | Tarefas recorrentes atribuídas aos mecânicos   |

## Pré-requisitos

- Node.js 22+
- Docker e Docker Compose

## Setup

```bash
# 1. Copiar variáveis de ambiente
cp .env.example .env

# 2. Subir o PostgreSQL (porta 5433 no host — evita conflito com PostgreSQL local na 5432)
docker compose up postgres -d

# 3. Instalar dependências
npm install

# 4. Rodar migrations
npm run db:migrate

# 5. Popular o banco com dados de exemplo
npm run db:seed

# 6. Iniciar em modo desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3000`.

## Docker (API + PostgreSQL)

```bash
docker compose up --build
```

## Scripts

| Script              | Descrição                        |
|---------------------|----------------------------------|
| `npm run dev`       | Servidor com hot reload          |
| `npm run build`     | Compila TypeScript               |
| `npm run start`     | Inicia servidor compilado        |
| `npm run db:migrate`| Aplica migrations                |
| `npm run db:seed`   | Popula banco com 5 registros/entidade |
| `npm run db:reset`  | Reseta banco + migrations + seed |

## Endpoints

Base URL: `/api`

| Método | Rota                | Descrição           |
|--------|---------------------|---------------------|
| GET    | `/users`            | Listar usuários     |
| GET    | `/users/:id`        | Buscar usuário      |
| POST   | `/users`            | Criar usuário       |
| PUT    | `/users/:id`        | Atualizar usuário   |
| DELETE | `/users/:id`        | Remover usuário     |
| GET    | `/clientes`         | Listar clientes     |
| GET    | `/clientes/:id`     | Buscar cliente      |
| POST   | `/clientes`         | Criar cliente       |
| PUT    | `/clientes/:id`     | Atualizar cliente   |
| DELETE | `/clientes/:id`     | Remover cliente     |
| GET    | `/mecanicos`        | Listar mecânicos    |
| GET    | `/mecanicos/:id`    | Buscar mecânico     |
| POST   | `/mecanicos`        | Criar mecânico      |
| PUT    | `/mecanicos/:id`    | Atualizar mecânico  |
| DELETE | `/mecanicos/:id`    | Remover mecânico    |
| GET    | `/pedidos`          | Listar pedidos      |
| GET    | `/pedidos/:id`      | Buscar pedido       |
| POST   | `/pedidos`          | Criar pedido        |
| PUT    | `/pedidos/:id`      | Atualizar pedido    |
| DELETE | `/pedidos/:id`      | Remover pedido      |
| GET    | `/avaliacoes`       | Listar avaliações   |
| GET    | `/avaliacoes/:id`   | Buscar avaliação    |
| POST   | `/avaliacoes`       | Criar avaliação     |
| PUT    | `/avaliacoes/:id`   | Atualizar avaliação |
| DELETE | `/avaliacoes/:id`   | Remover avaliação   |
| GET    | `/servicos`         | Listar serviços     |
| GET    | `/servicos/:id`     | Buscar serviço      |
| POST   | `/servicos`         | Criar serviço       |
| PUT    | `/servicos/:id`     | Atualizar serviço   |
| DELETE | `/servicos/:id`     | Remover serviço     |
| GET    | `/tarefas-semanais` | Listar tarefas      |
| GET    | `/tarefas-semanais/:id` | Buscar tarefa   |
| POST   | `/tarefas-semanais` | Criar tarefa        |
| PUT    | `/tarefas-semanais/:id` | Atualizar tarefa |
| DELETE | `/tarefas-semanais/:id` | Remover tarefa   |

## Credenciais de teste (seed)

Todos os usuários do seed usam a senha: `123456`

- Admin: `admin@webmec.com`
- Cliente: `carlos.silva@email.com`
- Mecânico: `joao.mecanico@webmec.com`
