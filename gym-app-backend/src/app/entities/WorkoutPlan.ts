import { ExerciseInPlan } from '../entities/ExerciseInPlan';

export class WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  htmlContent?: string;
  clientId: string;
  instructorId: string;
  exercisesInPlan: ExerciseInPlan[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id?: string;
    name: string;
    description?: string;
    htmlContent?: string;
    clientId: string;
    instructorId: string;
    exercisesInPlan?: ExerciseInPlan[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || '';
    this.name = data.name;
    this.description = data.description;
    this.htmlContent = data.htmlContent;
    this.clientId = data.clientId;
    this.instructorId = data.instructorId;
    this.exercisesInPlan = data.exercisesInPlan || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      htmlContent: this.htmlContent,
      clientId: this.clientId,
      instructorId: this.instructorId,
      exercisesInPlan: this.exercisesInPlan.map(ex => ex.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
} 