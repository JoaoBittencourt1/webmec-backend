-- AlterTable
ALTER TABLE "users" ADD COLUMN "documento" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_documento_key" ON "users"("documento");

-- AlterTable
ALTER TABLE "clientes" ALTER COLUMN "telefone" DROP NOT NULL;
ALTER TABLE "clientes" ALTER COLUMN "endereco" DROP NOT NULL;
