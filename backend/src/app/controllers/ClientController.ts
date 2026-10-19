import { NextFunction, Request, Response } from 'express';
import ClientService, { ClientCreateData, ClientUpdateData } from '../services/ClientService';

// Supondo que o ID do instrutor logado virá de um middleware de autenticação
// e será adicionado ao objeto `req` (ex: req.user.id ou req.instructorId)
// Para este exemplo, vamos simular pegando de `req.body` ou `req.params` quando necessário.

export class ClientController {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            // Em um app real, o instructorId viria do usuário autenticado (ex: req.user.id)
            // Para este exemplo, vamos supor que ele é enviado no corpo da requisição.
            const { name, email, phone, externalId, instructorId } = req.body as ClientCreateData;

            if (!name || !instructorId) {
                return res.status(400).json({ message: "Name and instructorId are required" });
            }

            const clientData = { name, email, phone, externalId, instructorId };
            const newClient = await ClientService.create(clientData);
            return res.status(201).json(newClient);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                return res.status(409).json({ message: "Client email already exists" });
            }
            if (error.message.includes('Instructor with ID')) { // Erro personalizado do nosso serviço
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message || "Failed to create client" });
        }


    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            // Se você quiser listar todos os clientes globalmente (admin) ou
            // filtrar por instrutor (ex: req.query.instructorId ou req.user.id se autenticado)
            const { instructorId } = req.query; // Exemplo: /api/clients?instructorId=uuid-do-instrutor
            const clients = await ClientService.findAll(instructorId as string | undefined);
            return res.status(200).json(clients);
        } catch (error: any) {
            return res.status(500).json({ message: error.message || "Failed to retrieve clients" });
        }
    }

    async findAllByInstructor(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            // Supondo que o ID do instrutor é um parâmetro de rota ou viria do usuário autenticado
            // Ex: /api/instructors/:instructorId/clients
            const { instructorId } = req.params;
            if (!instructorId) {
                return res.status(400).json({ message: "Instructor ID is required" });
            }
            const clients = await ClientService.findAllByInstructor(instructorId);
            return res.status(200).json(clients);
        } catch (error: any) {
            return res.status(500).json({ message: error.message || "Failed to retrieve instructor's clients" });
        }
    }

    async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { id } = req.params;
            // const instructorId = req.user.id; // Se houver autenticação de instrutor
            const client = await ClientService.findById(id /*, instructorId */);
            if (!client) {
                return res.status(404).json({ message: "Client not found" });
            }
            return res.status(200).json(client);
        } catch (error: any) {
            return res.status(500).json({ message: error.message || "Failed to retrieve client" });
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { id } = req.params;
            const data = req.body as ClientUpdateData;
            // const instructorId = req.user.id; // Para verificar permissão

            const updatedClient = await ClientService.update(id, data /*, instructorId */);
            if (!updatedClient) {
                return res.status(404).json({ message: "Client not found" });
            }
            return res.status(200).json(updatedClient);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                return res.status(409).json({ message: "Client email already exists" });
            }
            if (error.code === 'P2025' || error.message.includes('Client not found or access denied')) {
                return res.status(404).json({ message: "Client not found or access denied" });
            }
            return res.status(500).json({ message: error.message || "Failed to update client" });
        }


    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { id } = req.params;
            // const instructorId = req.user.id; // Para verificar permissão

            const deletedClient = await ClientService.delete(id /*, instructorId */);
            if (!deletedClient) {
                return res.status(404).json({ message: "Client not found" });
            }
            return res.status(200).json({ message: "Client deleted successfully" });
        } catch (error: any) {
            if (error.code === 'P2025' || error.message.includes('Client not found or access denied')) {
                return res.status(404).json({ message: "Client not found or access denied" });
            }
            return res.status(500).json({ message: error.message || "Failed to delete client" });
        }


    }
}

export default new ClientController();