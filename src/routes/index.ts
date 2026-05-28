import { Router } from "express";
import { userController } from "../controllers/userController";
import { clienteController } from "../controllers/clienteController";
import { mecanicoController } from "../controllers/mecanicoController";
import { pedidoController } from "../controllers/pedidoController";
import { avaliacaoController } from "../controllers/avaliacaoController";
import { servicoController } from "../controllers/servicoController";
import { tarefaSemanalController } from "../controllers/tarefaSemanalController";

const router = Router();

router.get("/users", userController.list);
router.get("/users/:id", userController.getById);
router.post("/users", userController.create);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.remove);

router.get("/clientes", clienteController.list);
router.get("/clientes/:id", clienteController.getById);
router.post("/clientes", clienteController.create);
router.put("/clientes/:id", clienteController.update);
router.delete("/clientes/:id", clienteController.remove);

router.get("/mecanicos", mecanicoController.list);
router.get("/mecanicos/:id", mecanicoController.getById);
router.post("/mecanicos", mecanicoController.create);
router.put("/mecanicos/:id", mecanicoController.update);
router.delete("/mecanicos/:id", mecanicoController.remove);

router.get("/pedidos", pedidoController.list);
router.get("/pedidos/:id", pedidoController.getById);
router.post("/pedidos", pedidoController.create);
router.put("/pedidos/:id", pedidoController.update);
router.delete("/pedidos/:id", pedidoController.remove);

router.get("/avaliacoes", avaliacaoController.list);
router.get("/avaliacoes/:id", avaliacaoController.getById);
router.post("/avaliacoes", avaliacaoController.create);
router.put("/avaliacoes/:id", avaliacaoController.update);
router.delete("/avaliacoes/:id", avaliacaoController.remove);

router.get("/servicos", servicoController.list);
router.get("/servicos/:id", servicoController.getById);
router.post("/servicos", servicoController.create);
router.put("/servicos/:id", servicoController.update);
router.delete("/servicos/:id", servicoController.remove);

router.get("/tarefas-semanais", tarefaSemanalController.list);
router.get("/tarefas-semanais/:id", tarefaSemanalController.getById);
router.post("/tarefas-semanais", tarefaSemanalController.create);
router.put("/tarefas-semanais/:id", tarefaSemanalController.update);
router.delete("/tarefas-semanais/:id", tarefaSemanalController.remove);

export default router;
