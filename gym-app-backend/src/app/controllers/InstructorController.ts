import { Request, Response, NextFunction } from 'express';
import InstructorService, { InstructorCreateData, InstructorUpdateData } from '../services/InstructorService';
//import next function from express


export class InstructorController {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { name, email, password, avatar } = req.body as InstructorCreateData;

            if (!name || !email || !password) {
                return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
            }

            // Senha está sendo hasheada no serviço
            const instructorData = { name, email, password, avatar };

            const newInstructor = await InstructorService.create(instructorData);
            return res.status(201).json(newInstructor);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) { // Código de erro do Prisma para violação de unicidade
                return res.status(409).json({ message: "Email já existe" });
            }
            return res.status(500).json({ message: error.message || "Falha ao criar instrutor" });
        }


    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const instructors = await InstructorService.findAll();
            return res.status(200).json(instructors);
        } catch (error: any) {
            return res.status(500).json({ message: error.message || "Falha ao recuperar instrutores" });
        }
    }

    async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { id } = req.params;
            const instructor = await InstructorService.findById(id);
            if (!instructor) {
                return res.status(404).json({ message: "Instrutor não encontrado" });
            }
            return res.status(200).json(instructor);
        } catch (error: any) {
            return res.status(500).json({ message: error.message || "Falha ao recuperar instrutor" });
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { id } = req.params;
            const data = req.body as InstructorUpdateData;

            //Senha está sendo hasheada no serviço
            
            const updatedInstructor = await InstructorService.update(id, data);
            if (!updatedInstructor) {
                return res.status(404).json({ message: "Instrutor não encontrado" });
            }
            return res.status(200).json(updatedInstructor);
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                return res.status(409).json({ message: "Email já existe" });
            }
            if (error.code === 'P2025') { // Código de erro do Prisma para registro não encontrado ao atualizar/deletar
                return res.status(404).json({ message: "Instrutor não encontrado" });
            }
            return res.status(500).json({ message: error.message || "Falha ao atualizar instrutor" });
        }


    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { id } = req.params;
            const deletedInstructor = await InstructorService.delete(id);
            if (!deletedInstructor) {
                return res.status(404).json({ message: "Instrutor não encontrado" });
            }
            return res.status(200).json({ message: "Instrutor deletado com sucesso" });
        } catch (error: any) {
            if (error.code === 'P2025') {
                return res.status(404).json({ message: "Instrutor não encontrado" });
            }
            return res.status(500).json({ message: error.message || "Falha ao deletar instrutor" });
        }
    }
}

export default new InstructorController();