import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => void fn(req, res, next).catch(next);

router.post('/register', wrap(authController.register));
router.post('/login', wrap(authController.login));
router.get('/me', authMiddleware, wrap(authController.me));

export default router; 