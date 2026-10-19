export class Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id?: string;
    name: string;
    description?: string;
    muscleGroup?: string;
    videoUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || '';
    this.name = data.name;
    this.description = data.description;
    this.muscleGroup = data.muscleGroup;
    this.videoUrl = data.videoUrl;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      muscleGroup: this.muscleGroup,
      videoUrl: this.videoUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
} 