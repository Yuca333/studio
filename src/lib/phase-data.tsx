
import React from 'react';
import type { Phase } from './types';
import { Brain, Edit3, BarChart2, Lightbulb, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const phasesData: Phase[] = [
  {
    id: 'phase1',
    headline: 'Unternehmen Finden',
    imageSrc: 'https://the-decoder.com/wp-content/uploads/2025/03/deepersearch_grok.png',
    imageAlt: 'Screenshot of Grok AI interface',
    dataAiHint: 'AI search',
    description: (
      <>
        <p className="mb-3">
          Als erstes gibt du den Prompt an Grok um nach Unternehmen zu suchen die neue neue Webseite gebrauchen könnten. Verwende hier die Funktion DEEPER Research. Warte bis der Prompt fertig ist. Schau dir die Ergebnisse selber an und und beurteile ob da ein guter Kandidat dabei ist. Schau dir die Beispiel Screenshots die bei der Auswahl helfen könnten.
        </p>
        <div className="my-4 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href="https://hairgott.de/" target="_blank" rel="noopener noreferrer">Geeignetes Beispiel 1</a>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href="https://www.elektriker.de/" target="_blank" rel="noopener noreferrer">Geeignetes Beispiel 2</a>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href="https://www.pageou.de/de/" target="_blank" rel="noopener noreferrer">Nicht geeignetes Beispiel 1</a>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href="https://www.pfistermuehle.de/" target="_blank" rel="noopener noreferrer">Nicht geeignetes Beispiel 2</a>
            </Button>
          </div>
        </div>
        <p className="mt-3">
          Aber das sind nur Beispiele, im prinzip könnte jeder dieser Unternehmen anbeißen. Beurteile einfach selbst wo du denkst Bei den könnte es gut klappen
        </p>
      </>
    ),
    toolUrl: 'https://grok.com/',
    toolName: 'Grok (DeeperSearch)',
    toolNameJsx: <>Grok (<strong>Deeper</strong>Search)</>,
    toolIcon: Brain,
    promptFileName: [
      'phase1_unternehmen_finden_a.txt',
      'phase1_unternehmen_finden_b.txt',
      'phase1_unternehmen_finden_c.txt',
    ],
    imageAspectRatio: 'video',
  },
  {
    id: 'phase2',
    headline: 'Informationen vom Unternehmen rausziehen',
    imageSrc: 'https://placehold.co/600x900.png', // Portrait placeholder
    imageAlt: 'Google AI Studio run settings with Gemini 2.5 Pro Preview, Grounding, and URL Context enabled', // More descriptive alt
    dataAiHint: 'AI studio settings', // Matches image content
    description: (
      <>
        <p className="mb-2">Öffne Google AI Studio.</p>
        <p className="mb-2">Auf der rechten Seite Im Bereich "Run Settings" Stelle folgende sachen ein:</p>
        <ul className="list-disc list-inside mb-2 space-y-1 ml-4">
          <li>Erstes Feld (Drop Down): Gemini 2.5 Pro Preview</li>
        </ul>
        <p className="mb-1">Im Bereich "Tools":</p>
        <ul className="list-disc list-inside mb-2 space-y-1 ml-4">
          <li>Aktiviere Grounding with Google Search</li>
          <li>Aktiviere URL Context</li>
        </ul>
      </>
    ),
    toolUrl: 'https://aistudio.google.com/u/1/prompts/new_chat',
    toolName: 'Google AI Studio',
    toolIcon: Lightbulb,
    promptFileName: 'phase2_informationen_rausziehen.txt',
    imageAspectRatio: 'portrait',
  },
  {
    id: 'phase3',
    headline: 'Prompt für Website Genererierung erstellen',
    imageSrc: 'https://ai-rockstars.de/wp-content/uploads/2025/03/google-ai-studio.png',
    imageAlt: 'Screenshot of Google AI Studio interface',
    dataAiHint: 'AI studio',
    description: 'Kopiere den nächsten Prompt C und hänge am Ende Das an was beim letzten Prompt rauskam, füge auch das extra Dokument an.',
    toolUrl: 'https://aistudio.google.com/u/1/prompts/new_chat',
    toolName: 'Google AI Studio',
    toolIcon: Lightbulb,
    promptFileName: 'phase3_website_generierung.txt',
    extraAction: {
      text: 'Download extra Dokument',
      url: 'https://drive.google.com/file/d/1GhGJoQI7j0yB1V_z-M7aa5nOcAeALYvl/view?usp=sharing',
      icon: Download,
    },
    imageAspectRatio: 'video',
  },
  {
    id: 'phase4',
    headline: 'Erstelle 1. Version der Webseite',
    imageSrc: 'https://substackcdn.com/image/fetch/w_520,h_272,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0a313aa3-e74d-41bc-bb0f-9f28454d1220_2248x1164.png',
    imageAlt: 'Lovable interface showing generated website',
    dataAiHint: 'website generator',
    description: 'Kopiere das Ergebnis von dem letzten Prompt und füge ihn in Lovable ein',
    toolUrl: 'https://lovable.dev/',
    toolName: 'Lovable',
    toolIcon: Edit3,
    promptFileName: 'phase4_erste_webseite_version.txt', // This prompt file will be used
    imageAspectRatio: 'video',
  },
  {
    id: 'phaseA_error_handling',
    displayId: 'A',
    isOptional: true,
    headline: 'Umgang mit Fehlern.',
    description: 'Manchmal generiert Lovable Fehler, klicke dann einfach auf den button "Try to fix it" für die Schritte 4-6',
    imageSrc: 'https://media.datacamp.com/cms/ad_4nxfczqqh4bahj2pzq_yjghbv_bjqgmtzq-jokkhvrbmaflj8hrykgvufrwegs5kgwbamk5xl1bzjlqj0lzam6zbffv53plxtussmgh_5rbxt7vts0vijwnvv_ze9a1bhzvb5txwn.png',
    imageAlt: 'Fehlerbehandlung in Lovable',
    dataAiHint: 'error fix',
    toolUrl: '', 
    toolName: '', 
    toolIcon: undefined,
    promptFileName: null, 
    imageAspectRatio: 'video',
  },
  {
    id: 'phase5',
    headline: 'Webseite verbessern',
    imageSrc: 'https://mintlify.s3.us-west-1.amazonaws.com/lovable-f9060f1e/lovable-editor-v2.png',
    imageAlt: 'Lovable editor interface with chat window',
    dataAiHint: 'website editor',
    description: 'Kopiere diesen prompt in das chat fenster links ein, drücke erst auf "Chat" und klicke dann enter.\nWarte und wenn es fertig ist. drücke entweder auf Implement the Plan, oder schreibe "Implement the Plan" in den Chat',
    toolUrl: 'https://lovable.dev/',
    toolName: 'Lovable',
    toolIcon: Edit3,
    promptFileName: 'phase5_webseite_verbessern.txt',
    imageAspectRatio: 'video',
  },
  {
    id: 'phase6',
    headline: 'Abschluss Funktion',
    description: 'Zum schluss soll noch eine Information für den Kunden hinzugefügt werden.',
    imageSrc: 'https://substackcdn.com/image/fetch/w_520,h_272,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0a313aa3-e74d-41bc-bb0f-9f28454d1220_2248x1164.png',
    imageAlt: 'Lovable interface for final customer information',
    dataAiHint: 'customer info',
    toolUrl: 'https://lovable.dev/',
    toolName: 'Lovable',
    toolIcon: Edit3,
    promptFileName: 'phase6_abschluss_funktion.txt',
    imageAspectRatio: 'video',
  },
  {
    id: 'phase7',
    headline: 'In die Datenbank hinzufügen',
    description: 'Nimm den Prompt und gebe ihn wieder an Google AI Studio. Danach werden für dich informationen erstellt die du dann einfach in die Excel tabelle einfügen kannst. am Ende füge auch deinen Namen hinzu das falls dieser Kunde in Auftrag geht du deine Provision bekommst',
    imageSrc: 'https://media.gcflearnfree.org/content/55e073de7dd48174331f51b3_01_17_2014/getting_started_interactive2.png',
    imageAlt: 'Google Sheets interface for database entry',
    dataAiHint: 'spreadsheet database',
    toolUrl: 'https://docs.google.com/spreadsheets/d/1_GhSWvbrdzexArl77digCHz3mlhXgFu1S1zFnYPjsXE/edit?usp=sharing',
    toolName: 'Google Sheets',
    toolIcon: BarChart2,
    promptFileName: 'phase7_datenbank_eintrag.txt',
    imageAspectRatio: 'video',
  },
];
