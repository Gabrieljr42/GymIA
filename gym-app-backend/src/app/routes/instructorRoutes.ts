import { Router, Request, Response, NextFunction } from 'express';
import InstructorController from '../controllers/InstructorController';

const router = Router();

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => void fn(req, res, next).catch(next);

router.post('/instructors', wrap(InstructorController.create.bind(InstructorController)));
router.get('/instructors',  wrap(InstructorController.findAll.bind(InstructorController)));
router.get('/instructors/:id', wrap(InstructorController.findById.bind(InstructorController)));
router.put('/instructors/:id', wrap(InstructorController.update.bind(InstructorController)));
router.delete('/instructors/:id', wrap(InstructorController.delete.bind(InstructorController)));

export default router;