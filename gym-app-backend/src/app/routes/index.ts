import { Router } from 'express';
import authRoutes from './authRoutes';
import clientRoutes from './clientRoutes';
import instructorRoutes from './instructorRoutes';
import workoutPlanRoutes from './workoutPlanRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', clientRoutes);
router.use('/instructors', instructorRoutes);
router.use('/', workoutPlanRoutes);

export default router;