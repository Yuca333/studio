// 'use server'
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting the most appropriate AI tool for a given workflow phase.
 *
 * - aiToolSuggestion - A function that takes a description of a workflow phase and returns a suggestion for the best AI tool to use.
 * - AiToolSuggestionInput - The input type for the aiToolSuggestion function, which includes a description of the workflow phase.
 * - AiToolSuggestionOutput - The return type for the aiToolSuggestion function, which includes the suggested AI tool and a brief explanation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiToolSuggestionInputSchema = z.object({
  phaseDescription: z
    .string()
    .describe('A description of the workflow phase for which an AI tool is needed.'),
});
export type AiToolSuggestionInput = z.infer<typeof AiToolSuggestionInputSchema>;

const AiToolSuggestionOutputSchema = z.object({
  suggestedTool: z.string().describe('The name of the suggested AI tool.'),
  explanation: z
    .string()
    .describe('A brief explanation of why the suggested tool is appropriate for the phase.'),
});
export type AiToolSuggestionOutput = z.infer<typeof AiToolSuggestionOutputSchema>;

export async function aiToolSuggestion(input: AiToolSuggestionInput): Promise<AiToolSuggestionOutput> {
  return aiToolSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiToolSuggestionPrompt',
  input: {schema: AiToolSuggestionInputSchema},
  output: {schema: AiToolSuggestionOutputSchema},
  prompt: `You are an expert in AI tools and their applications in various workflows.

  Given the following description of a workflow phase, suggest the most appropriate AI tool to use and explain why it is a good fit.

  Description: {{{phaseDescription}}}

  Format your response as a JSON object with "suggestedTool" and "explanation" fields.
  `, // Ensure the output is a valid JSON with the given schema
});

const aiToolSuggestionFlow = ai.defineFlow(
  {
    name: 'aiToolSuggestionFlow',
    inputSchema: AiToolSuggestionInputSchema,
    outputSchema: AiToolSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
