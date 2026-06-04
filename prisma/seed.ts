import {
  PrismaClient,
  PedidoStatus,
  UserRole,
  DiaSemana,
  PrioridadeTarefa,
} from "@prisma/client";
import { auth } from "../src/lib/auth";

const prisma = new PrismaClient();

async function createAuthUser(
  email: string,
  password: string,
  name: string,
  role: UserRole,
) {
  const result = await auth.api.signUpEmail({
    body: { email, password, name, role },
  });
  return result.user;
}

async function main() {
  console.log("Iniciando seed...");

  await prisma.avaliacao.deleteMany();
  await prisma.favorito.deleteMany();
  await prisma.agendamento.deleteMany();
  await prisma.tarefaSemanal.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.mecanico.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  const adminUser = await createAuthUser(
    "admin@webmec.com",
    "123456",
    "Admin Sistema",
    UserRole.ADMIN,
  );

  const carlosUser = await createAuthUser(
    "carlos.silva@email.com",
    "123456",
    "Carlos Silva",
    UserRole.CLIENTE,
  );

  const anaUser = await createAuthUser(
    "ana.souza@email.com",
    "123456",
    "Ana Souza",
    UserRole.CLIENTE,
  );

  const joaoUser = await createAuthUser(
    "joao.mecanico@webmec.com",
    "123456",
    "João Mecânico",
    UserRole.MECANICO,
  );

  const mariaUser = await createAuthUser(
    "maria.mecanica@webmec.com",
    "123456",
    "Maria Mecânica",
    UserRole.MECANICO,
  );

  const users = [adminUser, carlosUser, anaUser, joaoUser, mariaUser];

  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        userId: carlosUser.id,
        nome: "Carlos Silva",
        email: "carlos.silva@email.com",
        telefone: "(11) 98765-4321",
        cpf: "123.456.789-01",
        endereco: "Rua das Flores, 100 - São Paulo, SP",
      },
    }),
    prisma.cliente.create({
      data: {
        userId: anaUser.id,
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
        userId: joaoUser.id,
        nome: "João Mecânico",
        email: "joao.mecanico@webmec.com",
        telefone: "(11) 91234-5678",
        cnpj: "12.345.678/0001-90",
        endereco: "Rua das Flores, 250 - São Paulo, SP",
        especialidade: "Motor e Transmissão",
        descricao: "Especialista em motores e transmissões com 15 anos de experiência.",
      },
    }),
    prisma.mecanico.create({
      data: {
        userId: mariaUser.id,
        nome: "Maria Mecânica",
        email: "maria.mecanica@webmec.com",
        telefone: "(11) 92345-6789",
        cnpj: "23.456.789/0001-01",
        endereco: "Av. Paulista, 1000 - São Paulo, SP",
        especialidade: "Elétrica Automotiva",
        descricao: "Diagnóstico e reparo de sistemas elétricos automotivos.",
      },
    }),
    prisma.mecanico.create({
      data: {
        nome: "Ricardo Freitas",
        email: "ricardo.freitas@webmec.com",
        telefone: "(21) 93456-7890",
        cnpj: "34.567.890/0001-12",
        endereco: "Rua do Comércio, 50 - Rio de Janeiro, RJ",
        especialidade: "Suspensão e Freios",
        descricao: "Oficina especializada em freios e suspensão.",
      },
    }),
    prisma.mecanico.create({
      data: {
        nome: "Fernanda Alves",
        email: "fernanda.alves@webmec.com",
        telefone: "(31) 94567-8901",
        cnpj: "45.678.901/0001-23",
        endereco: "Av. Brasil, 800 - Belo Horizonte, MG",
        especialidade: "Ar Condicionado",
        descricao: "Manutenção e recarga de ar condicionado automotivo.",
      },
    }),
    prisma.mecanico.create({
      data: {
        nome: "Lucas Mendes",
        email: "lucas.mendes@webmec.com",
        telefone: "(41) 95678-9012",
        cnpj: "56.789.012/0001-34",
        endereco: "Rua Paraná, 150 - Curitiba, PR",
        especialidade: "Injeção Eletrônica",
        descricao: "Diagnóstico avançado de injeção eletrônica.",
      },
    }),
  ]);

  await Promise.all([
    prisma.favorito.create({
      data: { clienteId: clientes[0].id, mecanicoId: mecanicos[0].id },
    }),
    prisma.favorito.create({
      data: { clienteId: clientes[0].id, mecanicoId: mecanicos[1].id },
    }),
    prisma.favorito.create({
      data: { clienteId: clientes[1].id, mecanicoId: mecanicos[0].id },
    }),
  ]);

  await Promise.all([
    prisma.agendamento.create({
      data: {
        mecanicoId: mecanicos[0].id,
        titulo: "Revisão de motor",
        descricao: "Cliente agendado para revisão completa",
        dataInicio: new Date("2026-06-10T09:00:00"),
        dataFim: new Date("2026-06-10T11:00:00"),
      },
    }),
    prisma.agendamento.create({
      data: {
        mecanicoId: mecanicos[0].id,
        titulo: "Troca de embreagem",
        dataInicio: new Date("2026-06-11T14:00:00"),
        dataFim: new Date("2026-06-11T17:00:00"),
      },
    }),
    prisma.agendamento.create({
      data: {
        mecanicoId: mecanicos[1].id,
        titulo: "Diagnóstico elétrico",
        descricao: "Verificação do sistema elétrico",
        dataInicio: new Date("2026-06-12T10:00:00"),
        dataFim: new Date("2026-06-12T12:00:00"),
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
  console.log(`  - ${users.length} users (senha: 123456)`);
  console.log(`  - ${clientes.length} clientes`);
  console.log(`  - ${mecanicos.length} mecânicos`);
  console.log(`  - 3 favoritos`);
  console.log(`  - 3 agendamentos`);
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
