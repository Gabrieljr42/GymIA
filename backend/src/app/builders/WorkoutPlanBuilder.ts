import { WorkoutPlan } from '../entities/WorkoutPlan';
import { ExerciseInPlan } from '../entities/ExerciseInPlan';

export class WorkoutPlanBuilder {
  private workoutPlan: Partial<WorkoutPlan>;

  constructor() {
    this.workoutPlan = {
      exercisesInPlan: [],
    };
  }

  withId(id: string): WorkoutPlanBuilder {
    this.workoutPlan.id = id;
    return this;
  }

  withName(name: string): WorkoutPlanBuilder {
    this.workoutPlan.name = name;
    return this;
  }

  withDescription(description: string): WorkoutPlanBuilder {
    this.workoutPlan.description = description;
    return this;
  }

  withHtmlContent(htmlContent: string): WorkoutPlanBuilder {
    this.workoutPlan.htmlContent = htmlContent;
    return this;
  }

  withClientId(clientId: string): WorkoutPlanBuilder {
    this.workoutPlan.clientId = clientId;
    return this;
  }

  withInstructorId(instructorId: string): WorkoutPlanBuilder {
    this.workoutPlan.instructorId = instructorId;
    return this;
  }

  withExerciseInPlan(exerciseInPlan: ExerciseInPlan): WorkoutPlanBuilder {
    if (!this.workoutPlan.exercisesInPlan) {
      this.workoutPlan.exercisesInPlan = [];
    }
    this.workoutPlan.exercisesInPlan.push(exerciseInPlan);
    return this;
  }

  withExercisesInPlan(exercisesInPlan: ExerciseInPlan[]): WorkoutPlanBuilder {
    this.workoutPlan.exercisesInPlan = exercisesInPlan;
    return this;
  }

  withCreatedAt(createdAt: Date): WorkoutPlanBuilder {
    this.workoutPlan.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): WorkoutPlanBuilder {
    this.workoutPlan.updatedAt = updatedAt;
    return this;
  }

  build(): WorkoutPlan {
    if (!this.workoutPlan.name) {
      throw new Error('Workout plan name is required');
    }
    if (!this.workoutPlan.clientId) {
      throw new Error('Client ID is required');
    }
    if (!this.workoutPlan.instructorId) {
      throw new Error('Instructor ID is required');
    }

    return new WorkoutPlan(this.workoutPlan as any);
  }
} 