
'use client';

import { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import PhaseCard from '@/components/PhaseCard';
import { phasesData } from '@/lib/phase-data.tsx';
import type { Phase } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export default function WorkflowAiPage() {
  const [isCompact, setIsCompact] = useState(false);
  const [prompts, setPrompts] = useState<Record<string, string | string[] | null>>({});
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

  useEffect(() => {
    const fetchAllPrompts = async () => {
      setIsLoadingPrompts(true);
      const fetchedPrompts: Record<string, string | string[] | null> = {};
      for (const phase of phasesData) {
        try {
          if (phase.promptFileName === null) { // Handle phases with no prompts
            fetchedPrompts[phase.id] = null;
            continue;
          }
          if (Array.isArray(phase.promptFileName)) {
            const individualPrompts = await Promise.all(
              phase.promptFileName.map(async (fileName) => {
                const response = await fetch(`/prompts/${fileName}`);
                if (response.ok) {
                  return await response.text();
                }
                console.error(`Failed to fetch sub-prompt: ${fileName}, status: ${response.status}, phase ID: ${phase.id}`);
                return null;
              })
            );
            if (individualPrompts.every(p => p !== null)) {
              fetchedPrompts[phase.id] = individualPrompts as string[];
            } else {
              fetchedPrompts[phase.id] = null;
              console.error(`One or more sub-prompts failed to load for phase: ${phase.id}`);
            }
          } else if (typeof phase.promptFileName === 'string') {
            const response = await fetch(`/prompts/${phase.promptFileName}`);
            if (response.ok) {
              fetchedPrompts[phase.id] = await response.text();
            } else {
              console.error(`Failed to fetch prompt: ${phase.promptFileName}, status: ${response.status}`);
              fetchedPrompts[phase.id] = null;
            }
          } else {
            fetchedPrompts[phase.id] = null;
          }
        } catch (error) {
          console.error(`Error fetching prompt(s) for ${phase.id}:`, error instanceof Error ? error.message : String(error));
          fetchedPrompts[phase.id] = null;
        }
      }
      setPrompts(fetchedPrompts);
      setIsLoadingPrompts(false);
    };

    fetchAllPrompts();
  }, []);

  const toggleCompactView = (checked: boolean) => {
    setIsCompact(checked);
  };
  
  const PhaseSkeleton = ({ isCompact, phaseIdentifier }: { isCompact: boolean, phaseIdentifier?: string | number }) => (
    <div className="w-full p-4 space-y-3 border rounded-lg shadow-lg bg-card">
      <div className="flex items-center gap-3">
        {phaseIdentifier && (
          <Skeleton className={cn("flex-shrink-0 rounded-full", isCompact ? "h-6 w-6" : "h-10 w-10")} />
        )}
        <Skeleton className={cn("rounded-full", isCompact ? "h-7 w-7" : "h-8 w-8", !phaseIdentifier ? "" : "hidden sm:block")} />
        <Skeleton className={cn("w-3/4", isCompact ? "h-5" : "h-8")} />
      </div>
      {!isCompact && (
        <>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="aspect-video">
            <Skeleton className="w-full h-full rounded-md" />
          </div>
        </>
      )}
      <div className={cn("flex justify-between", isCompact ? "mt-1" : "mt-2")}>
        <Skeleton className={cn("w-1/3", isCompact ? "h-8" : "h-10")} />
        <Skeleton className={cn("w-1/3", isCompact ? "h-8" : "h-10")} />
      </div>
    </div>
  );

  let visiblePhaseCounter = 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader isCompact={isCompact} onToggleCompact={toggleCompactView} />
      <main className="container mx-auto px-4 pb-12">
        
        {!isCompact && (
          <div className="my-8 p-6 bg-card text-card-foreground rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Willkommen bei WorkflowAI!</h2>
            <p className="mb-4 text-lg">
              Nach diesem Schema kannst du bei uns mitmachen. Schau dir einfach das Video kurz an.
            </p>
            <div className="aspect-video mb-6 rounded-lg overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/zDFY--jbaeU"
                title="WorkflowAI Einführungsvideo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-base">
              Für Grok, Google AI Studio und Loveable kannst du dir einfach mehrere gratis Accounts machen.
              <br /><br />
              Falls dir bei einem Account dir das Tool sagt das du nichts mehr erstellen darfst, wechsele einfach dort den Account, nach 24 Stunden wird das limit reseted und du kannst den selben Account wieder nutzen.
            </p>
          </div>
        )}

        <div className={cn("grid", isCompact ? "gap-1 md:gap-1.5" : "gap-8 md:gap-12")}>
          {isLoadingPrompts 
            ? phasesData.map((phase, index) => {
                if (isCompact && phase.isOptional) return null;
                let phaseIdentifier: string | number | undefined;
                if (phase.displayId) {
                  phaseIdentifier = phase.displayId;
                } else if (!phase.isOptional) {
                  // Calculate visible index for skeletons
                  const nonOptionalPhasesBefore = phasesData.slice(0, index).filter(p => !p.isOptional).length;
                  phaseIdentifier = nonOptionalPhasesBefore + 1;
                }
                return <PhaseSkeleton key={phase.id} isCompact={isCompact} phaseIdentifier={phaseIdentifier} />;
              })
            : phasesData.map((phase: Phase) => {
                if (isCompact && phase.isOptional) {
                  return null; // Don't render optional phases in compact view
                }
                let phaseIdentifier: string | number;
                if (phase.displayId) {
                  phaseIdentifier = phase.displayId;
                } else {
                  visiblePhaseCounter++;
                  phaseIdentifier = visiblePhaseCounter;
                }
                return (
                  <PhaseCard
                    key={phase.id}
                    phase={phase}
                    phaseNumber={phaseIdentifier}
                    isCompact={isCompact}
                    promptContent={prompts[phase.id]}
                  />
                );
              })}
        </div>
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border mt-12">
        <p className="mb-4">&copy; {new Date().getFullYear()} WorkflowAI. All rights reserved.</p>
        <Button asChild variant="outline" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <a href="https://t.me/+V2YZwP_5CyRlZmYx" target="_blank" rel="noopener noreferrer">
            <Send className="mr-2 h-4 w-4" />
            Bei Fragen schreibe uns in der Telegram Gruppe.
          </a>
        </Button>
      </footer>
    </div>
  );
}
