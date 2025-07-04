
'use server';

import { improvePrompt, ImprovePromptInput } from '@/ai/flows/improve-prompt';
import { testPrompt, TestPromptInput } from '@/ai/flows/test-prompt-playground';
import { generateQuiz, GenerateQuizInput, GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';
import { learningContent } from '@/data/content';
import { z } from 'zod';

const testPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty.'),
});

export async function testPromptAction(prevState: any, formData: FormData) {
  const validatedFields = testPromptSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const input: TestPromptInput = { promptText: validatedFields.data.prompt };
    const result = await testPrompt(input);
    return {
      message: 'Success',
      data: result.llmResponse,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while testing the prompt. Please try again.',
      data: null,
    };
  }
}

const improvePromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty.'),
});

export async function improvePromptAction(prevState: any, formData: FormData) {
  const validatedFields = improvePromptSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const input: ImprovePromptInput = { promptDraft: validatedFields.data.prompt };
    const result = await improvePrompt(input);
    return {
      message: 'Success',
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while improving the prompt. Please try again.',
      data: null,
    };
  }
}

function getLearningContentAsString(): string {
  let content = '';
  for (const level of Object.values(learningContent)) {
    content += `# ${level.title}\n\n${level.description}\n\n`;
    for (const topic of level.topics) {
      content += `## ${topic.title}\n\n`;
      content += `${topic.description}\n\n`;
      content += `**Type:** ${topic.type}\n\n`;
      content += `**Details:** ${topic.details}\n\n`;
      if (topic.example) {
        content += `**Example:** ${topic.example}\n\n`;
      }
    }
  }
  return content;
}


export async function generateQuizAction(): Promise<{ questions: GenerateQuizOutput['questions'] | null; error?: string }> {
  try {
    const content = getLearningContentAsString();
    const input: GenerateQuizInput = { learningContent: content };
    const result = await generateQuiz(input);
    return { questions: result.questions };
  } catch (error) {
    console.error(error);
    return {
      questions: null,
      error: 'Failed to generate quiz questions. Please try again later.',
    };
  }
}
