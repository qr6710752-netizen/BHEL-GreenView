// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An anomaly detection AI agent.
 *
 * - detectAnomalies - A function that handles the anomaly detection process.
 * - DetectAnomaliesInput - The input type for the detectAnomalies function.
 * - DetectAnomaliesOutput - The return type for the detectAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomaliesInputSchema = z.object({
  metricsData: z.string().describe('Time series data of energy consumption or waste generation.'),
  description: z.string().describe('The description of the metrics.'),
});
export type DetectAnomaliesInput = z.infer<typeof DetectAnomaliesInputSchema>;

const DetectAnomaliesOutputSchema = z.object({
  hasAnomalies: z.boolean().describe('Whether or not anomalies are detected.'),
  anomaliesSummary: z.string().describe('A summary of the detected anomalies.'),
});
export type DetectAnomaliesOutput = z.infer<typeof DetectAnomaliesOutputSchema>;

export async function detectAnomalies(input: DetectAnomaliesInput): Promise<DetectAnomaliesOutput> {
  return detectAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomaliesPrompt',
  input: {schema: DetectAnomaliesInputSchema},
  output: {schema: DetectAnomaliesOutputSchema},
  prompt: `You are an expert in time series data analysis, specializing in detecting anomalies in energy consumption and waste generation.

You will analyze the provided time series data and determine if any anomalies are present.
An anomaly is a significant deviation from the expected pattern.

Consider factors such as seasonality, trends, and unexpected spikes or dips.

Data Description: {{{description}}}
Data: {{{metricsData}}}

Based on your analysis, set the hasAnomalies output field to true if anomalies are detected, otherwise set it to false.
Provide a concise summary of the detected anomalies in the anomaliesSummary output field.
`,
});

const detectAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAnomaliesFlow',
    inputSchema: DetectAnomaliesInputSchema,
    outputSchema: DetectAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
