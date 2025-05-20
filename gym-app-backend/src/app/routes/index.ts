import { Router } from 'express';
import authRoutes from './authRoutes';
import clientRoutes from './clientRoutes';
import instructorRoutes from './instructorRoutes';
import workoutPlanRoutes from './workoutPlanRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', clientRoutes);
router.use('/instructors', instructorRoutes);
router.use('/', workoutPlanRoutes);
router.use('/', dashboardRoutes);

export default router;