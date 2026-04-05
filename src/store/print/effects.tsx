import { captureElementAsDataUrl } from '@/lib/utils';
import type { ZustandGet, ZustandSet } from '../types';
import type { PrintEffects, PrintState, PrintStore } from './types';

const generatePdf =
  (
    set: ZustandSet<PrintState>,
    get: ZustandGet<PrintStore>,
  ): PrintEffects['generatePdf'] =>
  async (selectedCards, captureRefs) => {
    set({ capturing: true });
    const { cutLines } = get();
    const images = (
      await Promise.all(
        selectedCards.map((card) => {
          const el = captureRefs.get(card.userCard.id);
          return el ? captureElementAsDataUrl(el) : null;
        }),
      )
    ).filter((img): img is string => img !== null);
    set({ pdfSnapshot: { images, cutLines }, capturing: false });
  };

const downloadPdf =
  (get: ZustandGet<PrintStore>): PrintEffects['downloadPdf'] =>
  async () => {
    const { pdfSnapshot } = get();
    if (!pdfSnapshot) return;
    const { pdf } = await import('@react-pdf/renderer');
    const { PdfDocument } = await import(
      '@/app/(dashboard)/profile/print/pdf-document'
    );
    const blob = await pdf(
      <PdfDocument
        images={pdfSnapshot.images}
        cutLines={pdfSnapshot.cutLines}
      />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cards.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

export const createEffects = (
  set: ZustandSet<PrintState>,
  get: ZustandGet<PrintStore>,
): PrintEffects => ({
  generatePdf: generatePdf(set, get),
  downloadPdf: downloadPdf(get),
});
