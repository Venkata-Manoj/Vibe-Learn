'use server';
/**
 * @fileOverview A flow for generating a quiz based on learning content.
 *
 * - generateQuiz - A function that accepts learning content and returns a set of quiz questions.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).length(4).describe('An array of exactly 4 possible answers.'),
  correctAnswer: z.string().describe('The correct answer, which must be one of the provided options.'),
});

const GenerateQuizInputSchema = z.object({
  topic: z.string().default('Prompt Engineering').describe('The topic to base the quiz questions on.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(10).describe('An array of exactly 10 quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert in creating educational quizzes on the topic of prompt engineering.
  Based on the topic of {{{topic}}}, generate exactly 10 unique multiple-choice questions to test a user's knowledge.
  For each question, provide 4 distinct options and clearly indicate the correct answer.
  The questions should cover different concepts related to the topic.
  `,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);
