
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
  promptFileName: string | string[]; // Can be a single file or an array for multiple options
  extraAction?: {
    text: string;
    url: string;
    icon?: React.ElementType;
  };
}
