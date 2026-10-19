import { Exercise } from '../entities/Exercise';

export class ExerciseBuilder {
  private exercise: Partial<Exercise>;

  constructor() {
    this.exercise = {};
  }

  withId(id: string): ExerciseBuilder {
    this.exercise.id = id;
    return this;
  }

  withName(name: string): ExerciseBuilder {
    this.exercise.name = name;
    return this;
  }

  withDescription(description: string): ExerciseBuilder {
    this.exercise.description = description;
    return this;
  }

  withMuscleGroup(muscleGroup: string): ExerciseBuilder {
    this.exercise.muscleGroup = muscleGroup;
    return this;
  }

  withVideoUrl(videoUrl: string): ExerciseBuilder {
    this.exercise.videoUrl = videoUrl;
    return this;
  }

  withCreatedAt(createdAt: Date): ExerciseBuilder {
    this.exercise.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): ExerciseBuilder {
    this.exercise.updatedAt = updatedAt;
    return this;
  }

  build(): Exercise {
    if (!this.exercise.name) {
      throw new Error('Exercise name is required');
    }

    return new Exercise(this.exercise as any);
  }
} 