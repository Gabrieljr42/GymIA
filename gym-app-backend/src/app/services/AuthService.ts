import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

interface CreateInstructorData {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  async createUser(data: CreateInstructorData) {
    const existingInstructor = await prisma.instructor.findUnique({
      where: { email: data.email },
    });

    if (existingInstructor) {
      throw new Error('Email já está em uso');
    }

    return prisma.instructor.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }

  async authenticate(email: string, password: string) {
    const instructor = await prisma.instructor.findUnique({
      where: { email },
    });

    if (!instructor) {
      throw new Error('Email ou senha inválidos');
    }

    const passwordMatch = await bcrypt.compare(password, instructor.password);

    if (!passwordMatch) {
      throw new Error('Email ou senha inválidos');
    }

    const token = this.generateToken(instructor);

    return { user: instructor, token };
  }

  generateToken(instructor: { id: string; email: string }) {
    return sign(
      { id: instructor.id, email: instructor.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );
  }
} 