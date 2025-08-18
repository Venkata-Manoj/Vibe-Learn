
'use server';

import { improvePrompt, ImprovePromptInput, ImprovePromptOutput } from '@/ai/flows/improve-prompt';
import { testPrompt, TestPromptInput, TestPromptOutput } from '@/ai/flows/test-prompt-playground';
import { generateQuiz, GenerateQuizInput, GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';
import { z } from 'zod';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';


const testPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty.'),
});

export async function testPromptAction(prevState: any, formData: FormData): Promise<{ message: string; data: TestPromptOutput['llmResponse'] | null; errors?: any; }> {
  const validatedFields = testPromptSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
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

export async function improvePromptAction(prevState: any, formData: FormData): Promise<{ message: string; data: ImprovePromptOutput | null; errors?: any; }> {
  const validatedFields = improvePromptSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
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


export async function generateQuizAction(): Promise<{ questions: GenerateQuizOutput['questions'] | null; error?: string }> {
  try {
    const input: GenerateQuizInput = { topic: 'Prompt Engineering' };
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
