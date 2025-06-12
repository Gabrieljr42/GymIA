import { Request, Response } from 'express';
import prisma from '../../shared/lib/prismaClient';
import { OpenAIService } from '../services/openai.service';

const openAIService = new OpenAIService();

export class ChatController {
  async createSession(req: Request, res: Response) {
    const { instructorId } = req.body;
    if (!instructorId) {
      return res.status(400).json({ message: 'instructorId is required' });
    }
    const session = await prisma.chatSession.create({ data: { instructorId } });
    res.json(session);
  }

  async listSessions(req: Request, res: Response) {
    const { instructorId } = req.query;
    if (!instructorId) {
      return res.status(400).json({ message: 'instructorId query parameter required' });
    }
    const sessions = await prisma.chatSession.findMany({
      where: { instructorId: String(instructorId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(sessions);
  }

  async listMessages(req: Request, res: Response) {
    const { sessionId } = req.params;
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  }

  async sendMessage(req: Request, res: Response) {
    const { sessionId } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // save user message
    await prisma.chatMessage.create({
      data: { sessionId, role: 'user', content },
    });

    // retrieve all previous messages
    const history = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
    const openAiMessages = history.map(m => ({ role: m.role as any, content: m.content }));

    // call OpenAI chat
    const reply = await openAIService.chat(openAiMessages);

    // save assistant message
    const assistantMsg = await prisma.chatMessage.create({
      data: { sessionId, role: 'assistant', content: reply },
    });
    res.json(assistantMsg);
  }
}
