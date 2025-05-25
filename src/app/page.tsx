'use client';

import { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import PhaseCard from '@/components/PhaseCard';
import AiToolSuggester from '@/components/AiToolSuggester';
import { phasesData } from '@/lib/phase-data';
import type { Phase } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function WorkflowAiPage() {
  const [isCompact, setIsCompact] = useState(false);
  const [prompts, setPrompts] = useState<Record<string, string | null>>({});
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

  useEffect(() => {
    const fetchAllPrompts = async () => {
      setIsLoadingPrompts(true);
      const fetchedPrompts: Record<string, string | null> = {};
      for (const phase of phasesData) {
        try {
          const response = await fetch(`/prompts/${phase.promptFileName}`);
          if (response.ok) {
            fetchedPrompts[phase.id] = await response.text();
          } else {
            console.error(`Failed to fetch prompt: ${phase.promptFileName}, status: ${response.status}`);
            fetchedPrompts[phase.id] = null; // Mark as unavailable
          }
        } catch (error) {
          console.error(`Error fetching prompt ${phase.promptFileName}:`, error);
          fetchedPrompts[phase.id] = null; // Mark as unavailable
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
  
  // Skeleton loader for phase cards while prompts are loading
  const PhaseSkeleton = () => (
    <div className="w-full p-4 space-y-4 border rounded-lg shadow-lg bg-card">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="aspect-video">
        <Skeleton className="w-full h-full rounded-md" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader isCompact={isCompact} onToggleCompact={toggleCompactView} />
      <main className="container mx-auto px-4 pb-12">
        <div className="grid gap-8 md:gap-12">
          {isLoadingPrompts 
            ? phasesData.map((phase) => <PhaseSkeleton key={phase.id} />)
            : phasesData.map((phase: Phase) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  isCompact={isCompact}
                  promptContent={prompts[phase.id]}
                />
              ))}
        </div>

        <div className="mt-16 pt-12 border-t border-border">
          <AiToolSuggester />
        </div>
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border mt-12">
        <p>&copy; {new Date().getFullYear()} WorkflowAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
