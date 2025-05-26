
import type React from 'react';

export interface Phase {
  id: string;
  headline: string;
  imageSrc: string;
  imageAlt: string;
  dataAiHint?: string;
  description: React.ReactNode; // Changed from string to React.ReactNode
  toolUrl: string;
  toolName: string;
  toolNameJsx?: React.ReactNode; // For rich text in tool button
  toolIcon?: React.ElementType; // Optional: For custom icons if lucide doesn't have specific ones
  promptFileName: string | string[] | null; // Can be a single file, array of prompts, or null
  extraAction?: {
    text: string;
    url: string;
    icon?: React.ElementType;
  };
  isOptional?: boolean; // For phases not shown in compact view and having special ID
  displayId?: string; // To display 'A' instead of a number
  imageAspectRatio?: 'video' | 'portrait' | 'square'; // Added for dynamic image aspect ratio
}
