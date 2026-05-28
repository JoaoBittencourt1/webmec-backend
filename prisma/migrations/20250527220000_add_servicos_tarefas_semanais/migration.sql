-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "PrioridadeTarefa" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateTable
CREATE TABLE "servicos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "duracao_minutos" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefas_semanais" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "mecanico_id" TEXT NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "prioridade" "PrioridadeTarefa" NOT NULL DEFAULT 'MEDIA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarefas_semanais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "servicos_nome_key" ON "servicos"("nome");

-- AddForeignKey
ALTER TABLE "tarefas_semanais" ADD CONSTRAINT "tarefas_semanais_mecanico_id_fkey" FOREIGN KEY ("mecanico_id") REFERENCES "mecanicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
