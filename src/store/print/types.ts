import type { CardSettings } from '@/lib/types';
import type { PrintableCard } from '@/app/(dashboard)/profile/print/page';

export type PdfSnapshot = {
  images: string[];
  cutLines: boolean;
};

export type PrintState = {
  selectedIds: Set<string>;
  cutLines: boolean;
  settings: CardSettings;
  capturing: boolean;
  pdfSnapshot: PdfSnapshot | null;
};

export type PrintActions = {
  init(ids: string[]): void;
  toggleCard(id: string): void;
  setCutLines(cutLines: boolean): void;
  setSettings(settings: Partial<CardSettings>): void;
};

export type PrintEffects = {
  generatePdf(
    selectedCards: PrintableCard[],
    captureRefs: Map<string, HTMLDivElement>,
  ): Promise<void>;
  downloadPdf(): Promise<void>;
};

export type PrintStore = PrintState & {
  actions: PrintActions;
  effects: PrintEffects;
};
