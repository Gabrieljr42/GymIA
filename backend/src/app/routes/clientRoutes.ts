import { Request, Response, NextFunction, Router } from 'express';
import ClientController from '../controllers/ClientController';

const router = Router();

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => void fn(req, res, next).catch(next);

router.post('/clients', wrap(ClientController.create.bind(ClientController))); // Criar cliente (precisa de instructorId no corpo)
router.get('/clients', wrap(ClientController.findAll.bind(ClientController))); // Listar todos os clientes (pode filtrar por ?instructorId=...)
router.get('/clients/:id', wrap(ClientController.findById.bind(ClientController))); // Buscar cliente por ID
router.put('/clients/:id', wrap(ClientController.update.bind(ClientController)));   // Atualizar cliente por ID
router.delete('/clients/:id', wrap(ClientController.delete.bind(ClientController))); // Deletar cliente por ID
router.get('/instructors/:instructorId/clients', wrap(ClientController.findAllByInstructor.bind(ClientController)));

export default router;
