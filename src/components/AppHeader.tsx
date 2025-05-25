
'use client';

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WorkflowIcon } from "lucide-react"; // Using a generic icon for WorkflowAI

interface AppHeaderProps {
  isCompact: boolean;
  onToggleCompact: (isCompact: boolean) => void;
}

export default function AppHeader({ isCompact, onToggleCompact }: AppHeaderProps) {
  return (
    <header className="py-6 mb-8 border-b border-border">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <WorkflowIcon className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">WorkflowAI</h1>
        </div>
        <div className="flex items-center space-x-3 p-4 border-2 border-primary rounded-xl bg-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <Switch
            id="compact-view-toggle"
            checked={isCompact}
            onCheckedChange={onToggleCompact}
            aria-label="Toggle compact view"
          />
          <Label htmlFor="compact-view-toggle" className="text-foreground font-semibold text-base cursor-pointer">Compact View</Label>
        </div>
      </div>
    </header>
  );
}
