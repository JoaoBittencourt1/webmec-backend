import { PrismaClient, PedidoStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  await prisma.avaliacao.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.mecanico.deleteMany();
  await prisma.user.deleteMany();

  const senhaHash = await bcrypt.hash("123456", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        nome: "Admin Sistema",
        email: "admin@webmec.com",
        documento: "00000000000",
        senha: senhaHash,
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        nome: "Carlos Silva",
        email: "carlos.silva@email.com",
        documento: "12345678901",
        senha: senhaHash,
        role: UserRole.CLIENTE,
      },
    }),
    prisma.user.create({
      data: {
        nome: "Ana Souza",
        email: "ana.souza@email.com",
        documento: "23456789012",
        senha: senhaHash,
        role: UserRole.CLIENTE,
      },
    }),
    prisma.user.create({
      data: {
        nome: "João Mecânico",
        email: "joao.mecanico@webmec.com",
        documento: "11122233344",
        senha: senhaHash,
        role: UserRole.MECANICO,
      },
    }),
    prisma.user.create({
      data: {
        nome: "Maria Mecânica",
        email: "maria.mecanica@webmec.com",
        documento: "55566677788",
        senha: senhaHash,
        role: UserRole.MECANICO,
      },
    }),
  ]);

  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        userId: users[1].id,
        nome: "Carlos Silva",
        email: "carlos.silva@email.com",
        telefone: "(11) 98765-4321",
        cpf: "12345678901",
        endereco: "Rua das Flores, 100 - São Paulo, SP",
      },
    }),
    prisma.cliente.create({
      data: {
        userId: users[2].id,
        nome: "Ana Souza",
        email: "ana.souza@email.com",
        telefone: "(21) 99876-5432",
        cpf: "23456789012",
        endereco: "Av. Brasil, 500 - Rio de Janeiro, RJ",
      },
    }),
    prisma.cliente.create({
      data: {
        nome: "Pedro Oliveira",
        email: "pedro.oliveira@email.com",
        telefone: "(31) 97654-3210",
        cpf: "34567890123",
        endereco: "Rua Minas, 200 - Belo Horizonte, MG",
      },
    }),
    prisma.cliente.create({
      data: {
        nome: "Juliana Costa",
        email: "juliana.costa@email.com",
        telefone: "(41) 96543-2109",
        cpf: "45678901234",
        endereco: "Rua Paraná, 300 - Curitiba, PR",
      },
    }),
    prisma.cliente.create({
      data: {
        nome: "Roberto Lima",
        email: "roberto.lima@email.com",
        telefone: "(51) 95432-1098",
        cpf: "56789012345",
        endereco: "Av. Ipiranga, 400 - Porto Alegre, RS",
      },
    }),
  ]);

  const mecanicos = await Promise.all([
    prisma.mecanico.create({
      data: {
        userId: users[3].id,
        nome: "João Mecânico",
        email: "joao.mecanico@webmec.com",
        telefone: "(11) 91234-5678",
        especialidade: "Motor e Transmissão",
      },
    }),
    prisma.mecanico.create({
      data: {
        userId: users[4].id,
        nome: "Maria Mecânica",
        email: "maria.mecanica@webmec.com",
        telefone: "(11) 92345-6789",
        especialidade: "Elétrica Automotiva",
      },
    }),
    prisma.mecanico.create({
      data: {
        nome: "Ricardo Freitas",
        email: "ricardo.freitas@webmec.com",
        telefone: "(21) 93456-7890",
        especialidade: "Suspensão e Freios",
      },
    }),
    prisma.mecanico.create({
      data: {
        nome: "Fernanda Alves",
        email: "fernanda.alves@webmec.com",
        telefone: "(31) 94567-8901",
        especialidade: "Ar Condicionado",
      },
    }),
    prisma.mecanico.create({
      data: {
        nome: "Lucas Mendes",
        email: "lucas.mendes@webmec.com",
        telefone: "(41) 95678-9012",
        especialidade: "Injeção Eletrônica",
      },
    }),
  ]);

  const pedidos = await Promise.all([
    prisma.pedido.create({
      data: {
        clienteId: clientes[0].id,
        mecanicoId: mecanicos[0].id,
        descricao: "Troca de óleo e filtros",
        status: PedidoStatus.CONCLUIDO,
        valor: 350.0,
      },
    }),
    prisma.pedido.create({
      data: {
        clienteId: clientes[1].id,
        mecanicoId: mecanicos[1].id,
        descricao: "Revisão elétrica completa",
        status: PedidoStatus.EM_ANDAMENTO,
        valor: 580.0,
      },
    }),
    prisma.pedido.create({
      data: {
        clienteId: clientes[2].id,
        mecanicoId: mecanicos[2].id,
        descricao: "Troca de pastilhas de freio",
        status: PedidoStatus.PENDENTE,
        valor: 420.0,
      },
    }),
    prisma.pedido.create({
      data: {
        clienteId: clientes[3].id,
        mecanicoId: mecanicos[3].id,
        descricao: "Recarga e manutenção do ar condicionado",
        status: PedidoStatus.CONCLUIDO,
        valor: 290.0,
      },
    }),
    prisma.pedido.create({
      data: {
        clienteId: clientes[4].id,
        mecanicoId: mecanicos[4].id,
        descricao: "Diagnóstico de injeção eletrônica",
        status: PedidoStatus.CANCELADO,
        valor: 150.0,
      },
    }),
  ]);

  await Promise.all([
    prisma.avaliacao.create({
      data: {
        pedidoId: pedidos[0].id,
        clienteId: clientes[0].id,
        mecanicoId: mecanicos[0].id,
        nota: 5,
        comentario: "Excelente serviço, carro ficou impecável!",
      },
    }),
    prisma.avaliacao.create({
      data: {
        pedidoId: pedidos[1].id,
        clienteId: clientes[1].id,
        mecanicoId: mecanicos[1].id,
        nota: 4,
        comentario: "Bom atendimento, serviço ainda em andamento.",
      },
    }),
    prisma.avaliacao.create({
      data: {
        pedidoId: pedidos[2].id,
        clienteId: clientes[2].id,
        mecanicoId: mecanicos[2].id,
        nota: 3,
        comentario: "Aguardando início do serviço.",
      },
    }),
    prisma.avaliacao.create({
      data: {
        pedidoId: pedidos[3].id,
        clienteId: clientes[3].id,
        mecanicoId: mecanicos[3].id,
        nota: 5,
        comentario: "Ar condicionado funcionando perfeitamente.",
      },
    }),
    prisma.avaliacao.create({
      data: {
        pedidoId: pedidos[4].id,
        clienteId: clientes[4].id,
        mecanicoId: mecanicos[4].id,
        nota: 2,
        comentario: "Pedido cancelado por falta de peça.",
      },
    }),
  ]);

  console.log("Seed concluído:");
  console.log(`  - ${users.length} users`);
  console.log(`  - ${clientes.length} clientes`);
  console.log(`  - ${mecanicos.length} mecânicos`);
  console.log(`  - ${pedidos.length} pedidos`);
  console.log(`  - 5 avaliações`);
  console.log("");
  console.log("Credenciais de teste (senha: 123456):");
  console.log("  Cliente Carlos: CPF 123.456.789-01 ou 12345678901");
  console.log("  Cliente Ana:    CPF 234.567.890-12 ou 23456789012");
}

main()
  .catch((error) => {
    console.error("Erro no seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
