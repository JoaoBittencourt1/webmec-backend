-- AlterTable: users (Better Auth compatibility)
ALTER TABLE "users" RENAME COLUMN "nome" TO "name";
ALTER TABLE "users" DROP COLUMN "senha";
ALTER TABLE "users" ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "image" TEXT;

-- CreateTable: Better Auth sessions
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Better Auth accounts
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Better Auth verifications
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- AlterTable: clientes
ALTER TABLE "clientes" ADD COLUMN "descricao" TEXT;
ALTER TABLE "clientes" ADD COLUMN "foto_perfil" BYTEA;

-- AlterTable: mecanicos
ALTER TABLE "mecanicos" ADD COLUMN "cnpj" TEXT;
ALTER TABLE "mecanicos" ADD COLUMN "endereco" TEXT;
ALTER TABLE "mecanicos" ADD COLUMN "descricao" TEXT NOT NULL DEFAULT '';
ALTER TABLE "mecanicos" ADD COLUMN "foto_perfil" BYTEA;

-- Backfill mecanicos cnpj and endereco for existing rows
UPDATE "mecanicos" SET
  "cnpj" = SUBSTRING(REPLACE("id", '-', ''), 1, 14),
  "endereco" = 'Endereço não informado'
WHERE "cnpj" IS NULL;

ALTER TABLE "mecanicos" ALTER COLUMN "cnpj" SET NOT NULL;
ALTER TABLE "mecanicos" ALTER COLUMN "endereco" SET NOT NULL;

CREATE UNIQUE INDEX "mecanicos_cnpj_key" ON "mecanicos"("cnpj");

-- CreateTable: favoritos
CREATE TABLE "favoritos" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "mecanico_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable: agendamentos
CREATE TABLE "agendamentos" (
    "id" TEXT NOT NULL,
    "mecanico_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_cliente_id_mecanico_id_key" ON "favoritos"("cliente_id", "mecanico_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_mecanico_id_fkey" FOREIGN KEY ("mecanico_id") REFERENCES "mecanicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_mecanico_id_fkey" FOREIGN KEY ("mecanico_id") REFERENCES "mecanicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
