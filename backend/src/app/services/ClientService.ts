import prisma from '../shared/lib/prismaClient'; 
import { Client, Instructor } from '@prisma/client';

export interface ClientCreateData {
    name: string;
    email?: string | null;
    phone?: string | null;
    externalId?: string | null;
    instructorId: string;
}

export interface ClientUpdateData {
    name?: string;
    email?: string | null;
    phone?: string | null;
    externalId?: string | null;
    // instructorId geralmente não é atualizado dessa forma,
    // a transferência de um cliente para outro instrutor pode ser uma operação específica.
}

type SafeInstructorSelect = {
    id: true;
    name: true;
    email: true;
    avatar: true;
    createdAt: true;
    updatedAt: true;
};

const instructorPublicDataSelect: SafeInstructorSelect = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    createdAt: true,
    updatedAt: true,
    };

export class ClientService {
    async create(data: ClientCreateData): Promise<Client> {
        // Verifica se o instrutor existe (opcional, mas boa prática)
        const instructorExists = await prisma.instructor.findUnique({
            where: { id: data.instructorId },
        });
        if (!instructorExists) {
            throw new Error(`Instructor with ID ${data.instructorId} not found.`);
        }

        return prisma.client.create({
            data,
        });
    }

    async findAll(instructorId ?: string): Promise<Client[]> {
        if(instructorId) {
            return prisma.client.findMany({
                where: { instructorId },
                include: { instructor: false } // Opcional: incluir dados do instrutor
            });
        }
        return prisma.client.findMany({
            include: { instructor: false } // Opcional: incluir dados do instrutor
        });
    }

    // Buscar todos os clientes de um instrutor específico
    async findAllByInstructor(instructorId: string): Promise<Client[]> {
        return prisma.client.findMany({
            where: { instructorId },
            include: { instructor: false } // Geralmente não precisa dos dados do instrutor aqui
        });
    }

    async findById(id: string, instructorId ?: string): Promise<Client | null> {
        const whereClause: any = { id };
        if(instructorId) {
            whereClause.instructorId = instructorId; // Garante que o instrutor só acesse seus clientes
    }
return prisma.client.findUnique({
        where: whereClause,
        include: { instructor: false }
    });
}

    // Buscar um cliente específico de um instrutor
    async findClientByIdForInstructor(id: string, instructorId: string): Promise<Client | null> {
        return prisma.client.findFirst({ // findFirst para combinar múltiplos critérios de where
        where: {
            id,
            instructorId
        },
    });
}

    async update(id: string, data: ClientUpdateData, instructorId ?: string): Promise<Client | null> {
        const client = await this.findById(id, instructorId); // Verifica se o cliente existe e pertence ao instrutor (se instructorId for fornecido)
        if (!client) {
            throw new Error('Client not found or access denied.');
        }

        return prisma.client.update({
            where: { id },
            data,
        });
    }

    async delete (id: string, instructorId ?: string): Promise<Client | null> {
        const client = await this.findById(id, instructorId); // Verifica
        if (!client) {
            throw new Error('Client not found or access denied.');
        }
        return prisma.client.delete({
            where: { id },
        });
    }
}

export default new ClientService();