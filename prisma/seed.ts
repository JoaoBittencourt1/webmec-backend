import { PrismaClient, PedidoStatus, UserRole, DiaSemana, PrioridadeTarefa } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  await prisma.avaliacao.deleteMany();
  await prisma.tarefaSemanal.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.mecanico.deleteMany();
  await prisma.user.deleteMany();

  const senhaHash = await bcrypt.hash("123456", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        nome: "Admin Sistema",
        email: "admin@webmec.com",
        senha: senhaHash,
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        nome: "Carlos Silva",
        email: "carlos.silva@email.com",
        senha: senhaHash,
        role: UserRole.CLIENTE,
      },
    }),
    prisma.user.create({
      data: {
        nome: "Ana Souza",
        email: "ana.souza@email.com",
        senha: senhaHash,
        role: UserRole.CLIENTE,
      },
    }),
    prisma.user.create({
      data: {
        nome: "João Mecânico",
        email: "joao.mecanico@webmec.com",
        senha: senhaHash,
        role: UserRole.MECANICO,
      },
    }),
    prisma.user.create({
      data: {
        nome: "Maria Mecânica",
        email: "maria.mecanica@webmec.com",
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
        cpf: "123.456.789-01",
        endereco: "Rua das Flores, 100 - São Paulo, SP",
      },
    }),
    prisma.cliente.create({
      data: {
        userId: users[2].id,
        nome: "Ana Souza",
        email: "ana.souza@email.com",
        telefone: "(21) 99876-5432",
        cpf: "234.567.890-12",
        endereco: "Av. Brasil, 500 - Rio de Janeiro, RJ",
      },
    }),
    prisma.cliente.create({
      data: {
        nome: "Pedro Oliveira",
        email: "pedro.oliveira@email.com",
        telefone: "(31) 97654-3210",
        cpf: "345.678.901-23",
        endereco: "Rua Minas, 200 - Belo Horizonte, MG",
      },
    }),
    prisma.cliente.create({
      data: {
        nome: "Juliana Costa",
        email: "juliana.costa@email.com",
        telefone: "(41) 96543-2109",
        cpf: "456.789.012-34",
        endereco: "Rua Paraná, 300 - Curitiba, PR",
      },
    }),
    prisma.cliente.create({
      data: {
        nome: "Roberto Lima",
        email: "roberto.lima@email.com",
        telefone: "(51) 95432-1098",
        cpf: "567.890.123-45",
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

  const servicos = await Promise.all([
    prisma.servico.create({
      data: {
        nome: "Troca de Óleo",
        descricao: "Troca de óleo do motor e filtro de óleo",
        preco: 180.0,
        duracaoMinutos: 45,
      },
    }),
    prisma.servico.create({
      data: {
        nome: "Revisão de Freios",
        descricao: "Inspeção e troca de pastilhas e discos de freio",
        preco: 420.0,
        duracaoMinutos: 120,
      },
    }),
    prisma.servico.create({
      data: {
        nome: "Alinhamento e Balanceamento",
        descricao: "Alinhamento de direção e balanceamento das rodas",
        preco: 150.0,
        duracaoMinutos: 60,
      },
    }),
    prisma.servico.create({
      data: {
        nome: "Recarga de Ar Condicionado",
        descricao: "Recarga de gás e verificação do sistema de climatização",
        preco: 290.0,
        duracaoMinutos: 90,
      },
    }),
    prisma.servico.create({
      data: {
        nome: "Diagnóstico Eletrônico",
        descricao: "Leitura de códigos de falha e diagnóstico computadorizado",
        preco: 120.0,
        duracaoMinutos: 30,
        ativo: true,
      },
    }),
  ]);

  const tarefasSemanais = await Promise.all([
    prisma.tarefaSemanal.create({
      data: {
        titulo: "Organizar ferramentas",
        descricao: "Conferir e organizar o kit de ferramentas da bancada",
        diaSemana: DiaSemana.SEGUNDA,
        mecanicoId: mecanicos[0].id,
        prioridade: PrioridadeTarefa.MEDIA,
      },
    }),
    prisma.tarefaSemanal.create({
      data: {
        titulo: "Verificar estoque de peças",
        descricao: "Conferir estoque mínimo de filtros, óleos e pastilhas",
        diaSemana: DiaSemana.TERCA,
        mecanicoId: mecanicos[1].id,
        prioridade: PrioridadeTarefa.ALTA,
      },
    }),
    prisma.tarefaSemanal.create({
      data: {
        titulo: "Limpeza da área de serviço",
        descricao: "Limpar elevadores, chão e bancadas de trabalho",
        diaSemana: DiaSemana.QUARTA,
        mecanicoId: mecanicos[2].id,
        concluida: true,
        prioridade: PrioridadeTarefa.BAIXA,
      },
    }),
    prisma.tarefaSemanal.create({
      data: {
        titulo: "Calibração de equipamentos",
        descricao: "Calibrar torquímetros e equipamentos de diagnóstico",
        diaSemana: DiaSemana.QUINTA,
        mecanicoId: mecanicos[3].id,
        prioridade: PrioridadeTarefa.ALTA,
      },
    }),
    prisma.tarefaSemanal.create({
      data: {
        titulo: "Revisão de veículos em fila",
        descricao: "Priorizar ordens de serviço pendentes para a semana",
        diaSemana: DiaSemana.SEXTA,
        mecanicoId: mecanicos[4].id,
        prioridade: PrioridadeTarefa.MEDIA,
      },
    }),
  ]);

  console.log("Seed concluído:");
  console.log(`  - ${users.length} users`);
  console.log(`  - ${clientes.length} clientes`);
  console.log(`  - ${mecanicos.length} mecânicos`);
  console.log(`  - ${pedidos.length} pedidos`);
  console.log(`  - 5 avaliações`);
  console.log(`  - ${servicos.length} serviços`);
  console.log(`  - ${tarefasSemanais.length} tarefas semanais`);
}

main()
  .catch((error) => {
    console.error("Erro no seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
