import { ExerciseInPlan } from '../entities/ExerciseInPlan';
import { Exercise } from '../entities/Exercise';

export class ExerciseInPlanBuilder {
  private exerciseInPlan: Partial<ExerciseInPlan>;

  constructor() {
    this.exerciseInPlan = {
      order: 0,
    };
  }

  withId(id: string): ExerciseInPlanBuilder {
    this.exerciseInPlan.id = id;
    return this;
  }

  withSets(sets: string): ExerciseInPlanBuilder {
    this.exerciseInPlan.sets = sets;
    return this;
  }

  withReps(reps: string): ExerciseInPlanBuilder {
    this.exerciseInPlan.reps = reps;
    return this;
  }

  withRest(rest: string): ExerciseInPlanBuilder {
    this.exerciseInPlan.rest = rest;
    return this;
  }

  withObservations(observations: string): ExerciseInPlanBuilder {
    this.exerciseInPlan.observations = observations;
    return this;
  }

  withOrder(order: number): ExerciseInPlanBuilder {
    this.exerciseInPlan.order = order;
    return this;
  }

  withWorkoutPlanId(workoutPlanId: string): ExerciseInPlanBuilder {
    this.exerciseInPlan.workoutPlanId = workoutPlanId;
    return this;
  }

  withExerciseId(exerciseId: string): ExerciseInPlanBuilder {
    this.exerciseInPlan.exerciseId = exerciseId;
    return this;
  }

  withExercise(exercise: Exercise): ExerciseInPlanBuilder {
    this.exerciseInPlan.exercise = exercise;
    return this;
  }

  withCreatedAt(createdAt: Date): ExerciseInPlanBuilder {
    this.exerciseInPlan.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): ExerciseInPlanBuilder {
    this.exerciseInPlan.updatedAt = updatedAt;
    return this;
  }

  build(): ExerciseInPlan {
    if (!this.exerciseInPlan.workoutPlanId) {
      throw new Error('Workout plan ID is required');
    }
    if (!this.exerciseInPlan.exerciseId) {
      throw new Error('Exercise ID is required');
    }

    return new ExerciseInPlan(this.exerciseInPlan as any);
  }
} 