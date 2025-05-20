// src/app/services/InstructorService.ts



import prisma from '../shared/lib/prismaClient';
import { Instructor } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// DTOs para melhor validação e tipagem
export class InstructorCreateDTO {
    name!: string;
    email!: string;
    password!: string; // Será tratada (hash) antes de salvar
    avatar?: string | null;
}

export interface InstructorCreateData {
    name: string;
    email: string;
    password: string;
    avatar?: string | null;
}

export interface InstructorUpdateData {
    name?: string;
    email?: string;
    password?: string;
    avatar?: string | null;
}

export class InstructorUpdateDTO {
    name?: string;
    email?: string;
    password?: string;
    avatar?: string | null;
}

type SafeInstructor = Omit<Instructor, 'password'>;


export class InstructorService {
    // Criar um novo instrutor
    async create(data: InstructorCreateDTO): Promise<SafeInstructor> {
        if (!data.password) {
            throw new Error("Password is required for new instructor");
        }

        // Hash da senha antes de armazenar
        const hashedPassword = await bcrypt.hash(data.password, 10);

        return prisma.instructor.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                avatar: data.avatar,
            },
        });
    }

    // Buscar todos os instrutores
    async findAll(): Promise<SafeInstructor[]> {
        return prisma.instructor.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    // Buscar um instrutor pelo ID
    async findById(id: string): Promise<SafeInstructor | null> {
        return prisma.instructor.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,

            }
        });
    }

    // Buscar um instrutor pelo Email
    async findByEmail(email: string): Promise<SafeInstructor | null> {
        return prisma.instructor.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    // Atualizar um instrutor
    async update(id: string, data: InstructorUpdateDTO): Promise<SafeInstructor | null> {
        // Se a senha for atualizada, ela precisará ser hasheada
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return prisma.instructor.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    // Deletar um instrutor
    async delete(id: string): Promise<SafeInstructor | null> {
        return prisma.instructor.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
}

export default new InstructorService(); // Exporta uma instância do serviço