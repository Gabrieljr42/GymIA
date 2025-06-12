import OpenAI from 'openai';
import { prisma } from '../../lib/prisma';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateWorkoutPlan(
    clientId: string,
    instructorId: string,
    clientInfo: {
      name: string;
      gender: string;
      age: string;
      weight: string;
      height: string;
      bodyType: string;
      goal: string;
      level: string;
      injuries?: string;
      availability: string;
      preferences: string;
    }
  ) {
    try {
      const messages = [
        {
          role: "system" as const,
          content: `Você é um assistente especialista em educação física e personal trainer. 
          Sua função é gerar fichas de treino personalizadas em HTML, contendo apenas as tabelas de exercícios, séries, repetições, descanso e observações.
          Considere cuidadosamente todas as informações do cliente para criar um plano de treino seguro e eficaz.
          O plano deve ser adequado ao nível de experiência, disponibilidade e preferências do cliente.
          Inclua exercícios que respeitem quaisquer limitações físicas mencionadas.
          A resposta deve ser em formato HTML com uma tabela bem estruturada.`
        },
        {
          role: "user" as const,
          content: `Informações do Cliente:
          Nome: ${clientInfo.name}
          Gênero: ${clientInfo.gender}
          Idade: ${clientInfo.age} anos
          Peso: ${clientInfo.weight} kg
          Altura: ${clientInfo.height} cm
          Tipo Físico: ${clientInfo.bodyType}
          Objetivo: ${clientInfo.goal}
          Nível: ${clientInfo.level}
          ${clientInfo.injuries ? `Lesões/Limitações: ${clientInfo.injuries}` : ''}
          Disponibilidade: ${clientInfo.availability}
          Preferências: ${clientInfo.preferences}

         `
        },
      ];

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_FINE_TUNED_MODEL || 'gpt-3.5-turbo',
        messages,
        max_tokens: 10000,
        temperature: 0.7,
      });

      const generatedContent = completion.choices[0].message.content;

      const workoutPlan = await prisma.workoutPlan.create({
        data: {
          name: `Plano de Treino - ${clientInfo.name}`,
          description: `Plano personalizado para ${clientInfo.name} - Objetivo: ${clientInfo.goal}`,
          htmlContent: generatedContent,
          clientId,
          instructorId,
          gender: clientInfo.gender,
          age: clientInfo.age,
          weight: clientInfo.weight,
          height: clientInfo.height,
          bodyType: clientInfo.bodyType,
          goal: clientInfo.goal,
          level: clientInfo.level,
          injuries: clientInfo.injuries,
          availability: clientInfo.availability,
          preferences: clientInfo.preferences,
        },
      });

      return workoutPlan;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw new Error('Failed to generate workout plan');
    }
  }

  async chat(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    model: string = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini'
  ) {
    try {
      const completion = await this.openai.chat.completions.create({
        model,
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error during chat completion:', error);
      throw new Error('Chat completion failed');
    }
  }
}