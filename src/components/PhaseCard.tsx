
'use client';

import type { Phase } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Copy, AlertTriangle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhaseCardProps {
  phase: Phase;
  phaseNumber: number | string; // Can be number or 'A'
  isCompact: boolean;
  promptContent: string | string[] | null;
}

export default function PhaseCard({ phase, phaseNumber, isCompact, promptContent }: PhaseCardProps) {
  const { toast } = useToast();
  const [urlInput, setUrlInput] = useState('');

  const handleCopyPrompt = async () => {
    if (promptContent === null && phase.promptFileName === null) {
      toast({
        title: 'No Prompt to Copy',
        description: 'This phase does not have an associated prompt.',
      });
      return;
    }
    if (!promptContent && phase.promptFileName !== null) {
      toast({
        variant: 'destructive',
        title: 'Prompt Not Available',
        description: 'The prompt(s) for this phase could not be loaded.',
      });
      return;
    }

    let textToCopy: string | null = null;

    if (Array.isArray(promptContent)) {
      if (promptContent.length > 0) {
        const randomIndex = Math.floor(Math.random() * promptContent.length);
        textToCopy = promptContent[randomIndex];
      }
    } else if (typeof promptContent === 'string') {
      if (phase.id === 'phase2') {
        if (!urlInput.trim()) {
          toast({
            variant: 'destructive',
            title: 'URL fehlt',
            description: 'Bitte geben Sie eine URL in das Textfeld ein, um den Prompt zu vervollständigen.',
          });
          return;
        }
        if (promptContent.includes('PLACEHOLDER')) {
          textToCopy = promptContent.replace('PLACEHOLDER', urlInput.trim());
        } else {
          toast({
            variant: 'destructive',
            title: 'Prompt-Fehler',
            description: 'Der Prompt-Text enthält keinen "PLACEHOLDER". Bitte überprüfen Sie die Prompt-Datei.',
          });
          return;
        }
      } else {
        textToCopy = promptContent;
      }
    }

    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
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
    } else if (phase.promptFileName !== null) {
      toast({
        variant: 'destructive',
        title: 'Prompt Not Available',
        description: 'No prompt content to copy for this phase.',
      });
    }
  };

  const ToolIcon = phase.toolIcon || ExternalLink;
  const ExtraActionIcon = phase.extraAction?.icon || Download;

  const showMainToolButtons = !(phase.id === 'phase5' || phase.id === 'phase6' || phase.isOptional || !phase.toolUrl);
  
  const isPromptAvailable = promptContent !== null && (!Array.isArray(promptContent) || promptContent.length > 0);
  const hasPromptFile = phase.promptFileName !== null;

  const getImageAspectRatioClass = () => {
    switch (phase.imageAspectRatio) {
      case 'portrait':
        return 'aspect-[2/3]'; // Or 'aspect-[9/16]' if you prefer
      case 'square':
        return 'aspect-square';
      case 'video':
      default:
        return 'aspect-video';
    }
  };

  return (
    <Card className="w-full shadow-lg transition-all duration-300 ease-in-out">
      <CardHeader className={cn(isCompact ? 'p-2 pr-3' : 'p-6')}>
        <div className={cn("flex items-center gap-3", isCompact ? "mb-0" : "mb-1")}>
          <div className={cn("flex-shrink-0 flex items-center justify-center rounded-full font-bold shadow", isCompact ? "h-6 w-6 text-xs bg-primary text-primary-foreground" : "h-10 w-10 text-lg bg-primary text-primary-foreground")}>
            {phaseNumber}
          </div>
          <CardTitle className={cn("font-semibold", isCompact ? 'text-sm leading-tight line-clamp-2' : 'text-2xl')}>{phase.headline}</CardTitle>
        </div>
        {!isCompact && phase.description && (
          <CardDescription className="pt-1 text-base">{phase.description}</CardDescription>
        )}
      </CardHeader>

      {/* URL Input, Tool Link button, and Copy Prompt button row for Phase 2 */}
      {phase.id === 'phase2' && (
        <div className={cn("flex items-end gap-2", isCompact ? "p-2 pt-0" : "px-6 pb-4")}>
          <div className="flex-grow space-y-1">
            <Label 
              htmlFor={`url-input-${phase.id}`} 
              className={cn("font-medium", isCompact ? "text-xs" : "text-sm")}
            >
              Webseiten-URL für Analyse eingeben:
            </Label>
            <Input
              id={`url-input-${phase.id}`}
              type="url"
              placeholder="z.B. https://www.beispielseite.de"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className={cn(isCompact ? "h-8 text-xs px-2 py-1" : "h-10 text-base")}
            />
          </div>
          {phase.toolUrl && ( 
             <Button variant="outline" asChild size={isCompact ? 'sm' : 'default'} className={cn("shrink-0", isCompact ? "h-8" : "h-10")}>
              <a href={phase.toolUrl} target="_blank" rel="noopener noreferrer">
                  <ToolIcon className="mr-2 h-4 w-4" />
                  {phase.toolNameJsx || phase.toolName}
              </a>
            </Button>
          )}
          <Button
            onClick={handleCopyPrompt}
            disabled={!isPromptAvailable}
            size={isCompact ? 'sm' : 'default'}
            className={cn("shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground", isCompact ? "h-8" : "h-10")}
          >
            {!isPromptAvailable ? <AlertTriangle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {!isPromptAvailable ? (isCompact ? 'N/A' : 'Prompt Unavailable') : (isCompact ? 'Copy' : 'Copy Prompt')}
          </Button>
        </div>
      )}

      {!isCompact && phase.imageSrc && ( // Image and full description only in non-compact view
        <CardContent className={cn("transition-all duration-300 ease-in-out overflow-hidden", "p-6 pt-0")}>
          <div className={cn("mb-4 overflow-hidden rounded-md relative shadow-md", getImageAspectRatioClass())}>
            <Image
              src={phase.imageSrc}
              alt={phase.imageAlt}
              fill
              style={{objectFit: 'cover'}}
              data-ai-hint={phase.dataAiHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardContent>
      )}
      
      {/* Footer buttons, excluding phase 2 main tool button if it's handled above */}
      <CardFooter className={cn("flex items-center gap-2", isCompact ? 'p-2 flex-row justify-end' : 'p-6 pt-0 flex-col sm:flex-row justify-between')}>
        {showMainToolButtons && phase.id !== 'phase2' && phase.toolUrl && (
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
        
        {isCompact && !showMainToolButtons && phase.id !== 'phase2' && <div className="flex-grow"></div>}

        {phase.id !== 'phase2' && phase.id !== 'phase4' && hasPromptFile && !phase.isOptional && (
          <Button
            onClick={handleCopyPrompt}
            disabled={!isPromptAvailable}
            size={isCompact ? 'sm' : 'default'}
            className={cn(isCompact ? "w-auto" : "w-full sm:w-auto", "bg-primary hover:bg-primary/90 text-primary-foreground")}
          >
            {!isPromptAvailable ? <AlertTriangle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {!isPromptAvailable ? 'Prompt Unavailable' : 'Copy Prompt'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
