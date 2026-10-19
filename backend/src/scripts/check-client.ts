import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkClient() {
  try {
    const client = await prisma.client.findUnique({
      where: {
        id: 'fb5f5d44-9222-4f0b-bf3e-43aa6d69b62f'
      }
    });
    console.log('Client data:', client);
  } catch (error) {
    console.error('Error checking client:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClient(); 