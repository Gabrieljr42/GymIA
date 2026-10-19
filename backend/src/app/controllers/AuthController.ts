import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      const instructor = await this.authService.createUser({
        name,
        email,
        password: hashedPassword,
      });

      const token = this.authService.generateToken(instructor);

      return res.status(201).json({
        user: {
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          role: 'instructor',
        },
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const { user, token } = await this.authService.authenticate(email, password);

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'instructor',
        },
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      const instructor = await prisma.instructor.findUnique({
        where: { id: req.user?.id },
      });

      if (!instructor) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({
        user: {
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          role: 'instructor',
        },
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
} 