import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';

const router = Router();
const controller = new ChatController();

router.post('/chat-sessions', controller.createSession.bind(controller));
router.get('/chat-sessions', controller.listSessions.bind(controller));
router.get('/chat-sessions/:sessionId/messages', controller.listMessages.bind(controller));
router.post('/chat-sessions/:sessionId/messages', controller.sendMessage.bind(controller));

export default router;
