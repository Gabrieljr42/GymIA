export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  restTime: number;
  equipment?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  height: number;
  weight: number;
  goals: string[];
  workoutPlans: WorkoutPlan[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  clients: Client[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'client';
} 