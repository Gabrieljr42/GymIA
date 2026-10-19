import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestInstructor() {
  try {
    const instructor = await prisma.instructor.create({
      data: {
        id: 'test-instructor-id',
        name: 'Test Instructor',
        email: 'test.instructor@example.com',
        password: 'hashed_password_here' // In a real app, this would be properly hashed
      }
    });
    console.log('Test instructor created:', instructor);
  } catch (error) {
    console.error('Error creating test instructor:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestInstructor(); 