
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { aiToolSuggestion, type AiToolSuggestionOutput } from '@/ai/flows/ai-tool-suggestion';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const FormSchema = z.object({
  phaseDescription: z.string().min(10, {
    message: 'Phase description must be at least 10 characters.',
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function AiToolSuggester() {
  const [suggestion, setSuggestion] = useState<AiToolSuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phaseDescription: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setSuggestion(null);
    setError(null);
    try {
      const result = await aiToolSuggestion(data);
      setSuggestion(result);
    } catch (e) {
      console.error('Error fetching AI tool suggestion:', e instanceof Error ? e.message : String(e));
      setError('Failed to get AI tool suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold">
          <Wand2 className="mr-2 h-6 w-6 text-primary" />
          AI Tool Recommender
        </CardTitle>
        <CardDescription>
          Describe a workflow phase, and our AI will suggest a suitable tool.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="phaseDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'I need to create engaging social media posts with images for a new product launch.'"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Suggestion...
                </>
              ) : (
                'Suggest AI Tool'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {suggestion && (
        <CardContent>
          <Alert>
            <Wand2 className="h-4 w-4" />
            <AlertTitle>Suggested Tool: {suggestion.suggestedTool}</AlertTitle>
            <AlertDescription>{suggestion.explanation}</AlertDescription>
          </Alert>
        </CardContent>
      )}
      {error && (
         <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
