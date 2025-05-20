import { Router, Request, Response, NextFunction } from 'express';
import { WorkoutPlanController } from '../controllers/workout-plan.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const workoutPlanController = new WorkoutPlanController();

// Wrap async functions to handle errors
const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => void fn(req, res, next).catch(next);

// Generate a new workout plan
router.post(
  '/workout-plans',
  authMiddleware,
  wrap(workoutPlanController.generateWorkoutPlan.bind(workoutPlanController))
);

// Get a single workout plan by ID
router.get(
  '/workout-plans/:id',
  authMiddleware,
  wrap(workoutPlanController.getById.bind(workoutPlanController))
);

// Get all workout plans for a client
router.get(
  '/workout-plans/client/:clientId',
  authMiddleware,
  wrap(workoutPlanController.getWorkoutPlans.bind(workoutPlanController))
);

// Update a workout plan
router.put(
  '/workout-plans/:id',
  authMiddleware,
  wrap(workoutPlanController.update.bind(workoutPlanController))
);

// Update an exercise in a workout plan
router.put(
  '/workout-plans/:planId/exercises/:exerciseId',
  authMiddleware,
  wrap(workoutPlanController.updateExercise.bind(workoutPlanController))
);

export default router; 