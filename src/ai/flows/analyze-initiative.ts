'use server';

/**
 * @fileOverview An AI agent for analyzing green initiative proposals.
 *
 * - analyzeInitiative - A function that analyzes the potential impact of a green initiative.
 * - AnalyzeInitiativeInput - The input type for the analyzeInitiative function.
 * - AnalyzeInitiativeOutput - The return type for the analyzeInitiative function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeInitiativeInputSchema = z.object({
  title: z.string().describe('The title of the proposed initiative.'),
  description: z.string().describe('The detailed description of the initiative.'),
});
export type AnalyzeInitiativeInput = z.infer<typeof AnalyzeInitiativeInputSchema>;

const AnalyzeInitiativeOutputSchema = z.object({
  benefits: z.array(z.string()).describe('A list of potential benefits of the initiative.'),
  impact: z.enum(['High', 'Medium', 'Low']).describe('The estimated potential impact of the initiative.'),
  metrics: z.array(z.string()).describe('A list of suggested metrics to track the success of the initiative.'),
});
export type AnalyzeInitiativeOutput = z.infer<typeof AnalyzeInitiativeOutputSchema>;

export async function analyzeInitiative(input: AnalyzeInitiativeInput): Promise<AnalyzeInitiativeOutput> {
  return analyzeInitiativeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInitiativePrompt',
  input: { schema: AnalyzeInitiativeInputSchema },
  output: { schema: AnalyzeInitiativeOutputSchema },
  prompt: `You are an expert sustainability consultant. Analyze the following green initiative proposal submitted by an employee.

Based on the title and description, provide a structured analysis.

Initiative Title: {{{title}}}
Initiative Description: {{{description}}}

Your analysis should include:
- A list of the top 3-5 potential benefits.
- An estimated impact rating (High, Medium, or Low).
- A list of 2-3 key metrics that could be used to measure the success of this initiative.
`,
});

const analyzeInitiativeFlow = ai.defineFlow(
  {
    name: 'analyzeInitiativeFlow',
    inputSchema: AnalyzeInitiativeInputSchema,
    outputSchema: AnalyzeInitiativeOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
