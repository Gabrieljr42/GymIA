import { Request, Response } from 'express';
import { OpenAIService } from '../services/openai.service';
import { prisma } from '../../lib/prisma';

export class WorkoutPlanController {
  private openAIService: OpenAIService;

  constructor() {
    this.openAIService = new OpenAIService();
  }

  async generateWorkoutPlan(req: Request, res: Response): Promise<void> {
    try {
      const { 
        clientId, 
        name,
        gender,
        age,
        weight,
        height,
        bodyType,
        goal,
        level,
        injuries,
        availability,
        preferences
      } = req.body;
      
      const instructorId = req.user?.id;

      if (!instructorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Validate client exists and belongs to instructor
      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
          instructorId,
        },
      });

      if (!client) {
        res.status(404).json({ error: 'Client not found or not associated with this instructor' });
        return;
      }

      const workoutPlan = await this.openAIService.generateWorkoutPlan(
        clientId,
        instructorId,
        {
          name,
          gender,
          age,
          weight,
          height,
          bodyType,
          goal,
          level,
          injuries,
          availability,
          preferences
        }
      );

      res.status(201).json(workoutPlan);
    } catch (error) {
      console.error('Error in generateWorkoutPlan:', error);
      res.status(500).json({ error: 'Failed to generate workout plan' });
    }
  }

  async getWorkoutPlans(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;
      const instructorId = req.user?.id;

      if (!instructorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const workoutPlans = await prisma.workoutPlan.findMany({
        where: {
          clientId,
          instructorId,
        },
        include: {
          exercisesInPlan: {
            include: {
              exercise: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json(workoutPlans);
    } catch (error) {
      console.error('Error in getWorkoutPlans:', error);
      res.status(500).json({ error: 'Failed to fetch workout plans' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const instructorId = req.user?.id;

      if (!instructorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const workoutPlan = await prisma.workoutPlan.findFirst({
        where: {
          id,
          instructorId,
        },
        include: {
          client: true,
          exercisesInPlan: {
            include: {
              exercise: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      if (!workoutPlan) {
        res.status(404).json({ error: 'Workout plan not found' });
        return;
      }

      res.json(workoutPlan);
    } catch (error) {
      console.error('Error in getById:', error);
      res.status(500).json({ error: 'Failed to fetch workout plan' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { htmlContent } = req.body;
      const instructorId = req.user?.id;

      if (!instructorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get the current workout plan
      const currentPlan = await prisma.workoutPlan.findFirst({
        where: {
          id,
          instructorId,
        },
      });

      if (!currentPlan) {
        res.status(404).json({ error: 'Workout plan not found or not associated with this instructor' });
        return;
      }

      // Create an edit record
      await prisma.workoutPlanEdit.create({
        data: {
          workoutPlanId: id,
          instructorId,
          field: 'htmlContent',
          oldValue: currentPlan.htmlContent || '',
          newValue: htmlContent,
        }
      });

      // Update the workout plan
      const updatedPlan = await prisma.workoutPlan.update({
        where: { id },
        data: { htmlContent },
        include: {
          exercisesInPlan: {
            include: {
              exercise: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      res.json(updatedPlan);
    } catch (error) {
      console.error('Error in update:', error);
      res.status(500).json({ error: 'Failed to update workout plan' });
    }
  }

  async updateExercise(req: Request, res: Response): Promise<void> {
    try {
      const { planId, exerciseId } = req.params;
      const { field, value } = req.body;
      const instructorId = req.user?.id;

      if (!instructorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get the current workout plan and exercise
      const currentPlan = await prisma.workoutPlan.findFirst({
        where: {
          id: planId,
          instructorId,
        },
        include: {
          exercisesInPlan: {
            where: {
              id: exerciseId
            },
            include: {
              exercise: true
            }
          }
        }
      });

      if (!currentPlan) {
        res.status(404).json({ error: 'Workout plan not found or not associated with this instructor' });
        return;
      }

      const exerciseInPlan = currentPlan.exercisesInPlan[0];
      if (!exerciseInPlan) {
        res.status(404).json({ error: 'Exercise not found in this workout plan' });
        return;
      }

      // Create an edit record
      await prisma.workoutPlanEdit.create({
        data: {
          workoutPlanId: planId,
          instructorId,
          field: `exercise.${field}`,
          oldValue: field === 'name' ? exerciseInPlan.exercise.name : exerciseInPlan[field as keyof typeof exerciseInPlan]?.toString() || '',
          newValue: value,
        }
      });

      // Update the exercise
      let updatedExercise;
      if (field === 'name') {
        updatedExercise = await prisma.exerciseInPlan.update({
          where: { id: exerciseId },
          data: {
            exercise: {
              update: {
                name: value
              }
            }
          },
          include: {
            exercise: true
          }
        });
      } else {
        updatedExercise = await prisma.exerciseInPlan.update({
          where: { id: exerciseId },
          data: {
            [field]: value
          },
          include: {
            exercise: true
          }
        });
      }

      res.json(updatedExercise);
    } catch (error) {
      console.error('Error in updateExercise:', error);
      res.status(500).json({ error: 'Failed to update exercise' });
    }
  }
} 