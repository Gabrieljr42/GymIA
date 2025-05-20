import { Exercise } from './Exercise';

export class ExerciseInPlan {
  id: string;
  sets?: string;
  reps?: string;
  rest?: string;
  observations?: string;
  order: number;
  workoutPlanId: string;
  exerciseId: string;
  exercise?: Exercise;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id?: string;
    sets?: string;
    reps?: string;
    rest?: string;
    observations?: string;
    order?: number;
    workoutPlanId: string;
    exerciseId: string;
    exercise?: Exercise;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || '';
    this.sets = data.sets;
    this.reps = data.reps;
    this.rest = data.rest;
    this.observations = data.observations;
    this.order = data.order || 0;
    this.workoutPlanId = data.workoutPlanId;
    this.exerciseId = data.exerciseId;
    this.exercise = data.exercise;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      sets: this.sets,
      reps: this.reps,
      rest: this.rest,
      observations: this.observations,
      order: this.order,
      workoutPlanId: this.workoutPlanId,
      exerciseId: this.exerciseId,
      exercise: this.exercise?.toJSON(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
} 