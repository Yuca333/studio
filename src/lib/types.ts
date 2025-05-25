export interface Phase {
  id: string;
  headline: string;
  imageSrc: string;
  imageAlt: string;
  dataAiHint?: string;
  description: string;
  toolUrl: string;
  toolName: string;
  toolIcon?: React.ElementType; // Optional: For custom icons if lucide doesn't have specific ones
  promptFileName: string;
}
