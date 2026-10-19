import dotenv from 'dotenv';
dotenv.config();                     // ← load .env

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;

