import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateClient() {
  try {
    const client = await prisma.client.update({
      where: {
        id: 'fb5f5d44-9222-4f0b-bf3e-43aa6d69b62f'
      },
      data: {
        instructorId: 'test-instructor-id'
      }
    });
    console.log('Client updated:', client);
  } catch (error) {
    console.error('Error updating client:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateClient(); 