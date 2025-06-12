import express, { Request, Response } from 'express';
import prisma from './app/shared/lib/prismaClient'; // Corrigido o caminho
import apiRoutes from './app/routes'; // Importa o agregador de rotas
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both frontend ports
    origin: '*',
  credentials: true
}));

app.use(express.json());

// Rota de saúde básica
app.get('/', (req: Request, res: Response) => {
    res.send('Gym App Backend está no ar!');
});

// Usa as rotas da API com prefixo /api
app.use('/api', apiRoutes);

// Middleware para tratamento de rotas não encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware para tratamento de erros global
// (err, req, res, next) =\> {} - o 'next' é importante para o Express reconhecer como error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);   
    res.status(500).json({ message: 'Algo deu errado no servidor!', error: err.message });
});

const server = app.listen(Number(port), () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});

// Graceful shutdown
const shutdown = async () => {
    console.log('Desligando o servidor...');
    server.close(async () => {
        console.log('Servidor HTTP desligado.');
        await prisma.$disconnect();
        console.log('Conexão com o Prisma desligada.');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
