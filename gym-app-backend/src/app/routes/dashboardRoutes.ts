import { Router, Request, Response, NextFunction } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => void fn(req, res, next).catch(next);

router.get(
  '/dashboard/statistics',
  authMiddleware,
  wrap(dashboardController.getStatistics.bind(dashboardController))
);

export default router; 