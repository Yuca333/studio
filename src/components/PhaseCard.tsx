
'use client';

import type { Phase } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Copy, AlertTriangle, Download } from 'lucide-react';
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
        console.error('Failed to copy prompt: ', err instanceof Error ? err.message : String(err));
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

  const showToolButtons = !(phase.id === 'phase5' || phase.id === 'phase6');

  return (
    <Card className="w-full shadow-lg transition-all duration-300 ease-in-out">
      <CardHeader className={cn(isCompact ? 'p-2 pr-3' : 'p-6')}>
        <div className={cn("flex items-center gap-3", isCompact ? "mb-0" : "mb-1")}>
          <div className={cn("flex-shrink-0 flex items-center justify-center rounded-full font-bold shadow", isCompact ? "h-6 w-6 text-xs bg-primary text-primary-foreground" : "h-10 w-10 text-lg bg-primary text-primary-foreground")}>
            {phaseNumber}
          </div>
          <CardTitle className={cn("font-semibold", isCompact ? 'text-sm leading-tight' : 'text-2xl')}>{phase.headline}</CardTitle>
        </div>
        {!isCompact && phase.description && (
          <CardDescription className="pt-1 text-base">{phase.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn("transition-all duration-300 ease-in-out overflow-hidden", isCompact ? "max-h-0 p-0 opacity-0" : "max-h-[1000px] p-6 pt-0 opacity-100")}>
        {phase.imageSrc && (
          <div className="mb-4 overflow-hidden rounded-md aspect-video relative shadow-md">
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
      <CardFooter className={cn("flex items-center gap-2", isCompact ? 'p-2 flex-row justify-end' : 'p-6 pt-0 flex-col sm:flex-row justify-between')}>
        {showToolButtons && (
          <div className={cn("flex gap-2", isCompact ? "flex-row" : "flex-col sm:flex-row w-full sm:w-auto")}>
              <Button variant="outline" asChild size={isCompact ? 'sm' : 'default'} className={cn(isCompact ? "w-auto" : "w-full sm:w-auto")}>
              <a href={phase.toolUrl} target="_blank" rel="noopener noreferrer">
                  <ToolIcon className="mr-2 h-4 w-4" />
                  {phase.toolNameJsx || phase.toolName}
              </a>
              </Button>
              {phase.extraAction && (
              <Button variant="outline" asChild size={isCompact ? 'sm' : 'default'} className={cn(isCompact ? "w-auto" : "w-full sm:w-auto")}>
                  <a href={phase.extraAction.url} target="_blank" rel="noopener noreferrer">
                  <ExtraActionIcon className="mr-2 h-4 w-4" />
                  {phase.extraAction.text}
                  </a>
              </Button>
              )}
          </div>
        )}
        {isCompact && !showToolButtons && <div className="flex-grow"></div>} {/* Ensures "Copy Prompt" stays right in compact mode */}
        <Button
          onClick={handleCopyPrompt}
          disabled={!promptContent}
          size={isCompact ? 'sm' : 'default'}
          className={cn(isCompact ? "w-auto" : "w-full sm:w-auto", "bg-primary hover:bg-primary/90 text-primary-foreground")}
        >
          {promptContent === null ? <AlertTriangle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {promptContent === null ? 'Prompt Unavailable' : 'Copy Prompt'}
        </Button>
      </CardFooter>
    </Card>
  );
}
