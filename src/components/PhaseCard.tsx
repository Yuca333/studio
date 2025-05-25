
'use client';

import type { Phase } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Copy, AlertTriangle, Download } from 'lucide-react'; // Added Download
import { cn } from '@/lib/utils';

interface PhaseCardProps {
  phase: Phase;
  phaseNumber: number;
  isCompact: boolean;
  promptContent: string | null;
}

export default function PhaseCard({ phase, phaseNumber, isCompact, promptContent }: PhaseCardProps) {
  const { toast } = useToast();

  const handleCopyPrompt = async () => {
    if (promptContent) {
      try {
        await navigator.clipboard.writeText(promptContent);
        toast({
          title: 'Prompt Copied!',
          description: `Prompt for "${phase.headline}" copied to clipboard.`,
        });
      } catch (err) {
        console.error('Failed to copy prompt: ', err);
        toast({
          variant: 'destructive',
          title: 'Copy Failed',
          description: 'Could not copy prompt to clipboard.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Prompt Not Available',
        description: 'The prompt for this phase could not be loaded.',
      });
    }
  };

  const ToolIcon = phase.toolIcon || ExternalLink;
  const ExtraActionIcon = phase.extraAction?.icon || Download;


  return (
    <Card className="w-full shadow-lg transition-all duration-300 ease-in-out">
      <CardHeader>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 bg-primary text-primary-foreground rounded-full text-lg font-bold">
            {phaseNumber}
          </div>
          <CardTitle className="text-2xl font-semibold">{phase.headline}</CardTitle>
        </div>
        {!isCompact && phase.description && (
          <CardDescription className="pt-1 text-base">{phase.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn("transition-all duration-300 ease-in-out overflow-hidden", isCompact ? "max-h-0 p-0 opacity-0" : "max-h-[1000px] p-6 opacity-100")}>
        {phase.imageSrc && (
          <div className="mb-4 overflow-hidden rounded-md aspect-video relative">
            <Image 
              src={phase.imageSrc} 
              alt={phase.imageAlt} 
              fill 
              style={{objectFit: 'cover'}}
              data-ai-hint={phase.dataAiHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" asChild className="w-full sm:w-auto">
            <a href={phase.toolUrl} target="_blank" rel="noopener noreferrer">
                <ToolIcon className="mr-2 h-4 w-4" />
                {phase.toolName}
            </a>
            </Button>
            {phase.extraAction && (
            <Button variant="outline" asChild className="w-full sm:w-auto">
                <a href={phase.extraAction.url} target="_blank" rel="noopener noreferrer">
                <ExtraActionIcon className="mr-2 h-4 w-4" />
                {phase.extraAction.text}
                </a>
            </Button>
            )}
        </div>
        <Button onClick={handleCopyPrompt} disabled={!promptContent} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          {promptContent === null ? <AlertTriangle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {promptContent === null ? 'Prompt Unavailable' : 'Copy Prompt'}
        </Button>
      </CardFooter>
    </Card>
  );
}
