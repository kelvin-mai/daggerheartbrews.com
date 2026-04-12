import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createEffects } from '@/store/print/effects';
import type { PrintStore, PrintState } from '@/store/print/types';
import type { PrintableCard } from '@/app/(dashboard)/profile/print/page';
import type { UserCard } from '@/lib/types';

vi.mock('@/lib/utils', () => ({
  captureElementAsDataUrl: vi
    .fn()
    .mockResolvedValue('data:image/png;base64,abc'),
}));

vi.mock('@react-pdf/renderer', () => ({
  pdf: vi.fn(() => ({ toBlob: vi.fn().mockResolvedValue(new Blob(['pdf'])) })),
}));

vi.mock('@/app/(dashboard)/profile/print/pdf-document', () => ({
  PdfDocument: () => null,
}));

import { captureElementAsDataUrl } from '@/lib/utils';

const initialState: PrintState = {
  selectedIds: new Set(),
  cutLines: true,
  settings: {
    border: false,
    boldRulesText: true,
    artist: true,
    credits: true,
    placeholderImage: true,
    resolution: 1,
  },
  capturing: false,
  pdfSnapshot: null,
};

const makeCard = (id: string): PrintableCard => ({
  cardPreview: {} as PrintableCard['cardPreview'],
  userCard: { id } as UserCard,
  source: 'own',
});

const makeStore = (overrides: Partial<PrintState> = {}) => {
  let state: PrintState = { ...initialState, ...overrides };
  const set = vi.fn(
    (next: Partial<PrintState> | ((s: PrintState) => Partial<PrintState>)) => {
      state = {
        ...state,
        ...(typeof next === 'function' ? next(state) : next),
      };
    },
  );
  const get = (): PrintStore => ({
    ...state,
    actions: {} as PrintStore['actions'],
    effects: {} as PrintStore['effects'],
  });
  return { set, get, getState: () => state };
};

describe('print/effects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('generatePdf', () => {
    it('sets capturing: true then captures images and stores the snapshot', async () => {
      const { set, get } = makeStore({ cutLines: false });
      const effects = createEffects(set, get);

      const el = document.createElement('div');
      const refs = new Map([['card-1', el]]);
      const cards = [makeCard('card-1')];

      await effects.generatePdf(cards, refs);

      expect(captureElementAsDataUrl).toHaveBeenCalledWith(el);

      const calls = set.mock.calls.map((c) => c[0]) as Partial<PrintState>[];
      expect(calls[0]).toEqual({ capturing: true });
      expect(calls[1]).toMatchObject({
        capturing: false,
        pdfSnapshot: { images: ['data:image/png;base64,abc'], cutLines: false },
      });
    });

    it('skips cards whose ref is not in the map', async () => {
      const { set, get } = makeStore();
      const effects = createEffects(set, get);

      const refs = new Map<string, HTMLDivElement>();
      const cards = [makeCard('card-1'), makeCard('card-2')];

      await effects.generatePdf(cards, refs);

      expect(captureElementAsDataUrl).not.toHaveBeenCalled();

      const snapshotCall = set.mock.calls.find(
        (c) => (c[0] as Partial<PrintState>).pdfSnapshot !== undefined,
      );
      expect(snapshotCall?.[0]).toMatchObject({
        pdfSnapshot: { images: [] },
      });
    });

    it('resets capturing: false and does not set pdfSnapshot when capture throws', async () => {
      vi.mocked(captureElementAsDataUrl).mockRejectedValueOnce(
        new Error('render failed'),
      );

      const { set, get } = makeStore();
      const effects = createEffects(set, get);

      const el = document.createElement('div');
      const refs = new Map([['card-1', el]]);

      await expect(
        effects.generatePdf([makeCard('card-1')], refs),
      ).resolves.toBeUndefined();

      const calls = set.mock.calls.map((c) => c[0]) as Partial<PrintState>[];
      expect(calls[0]).toEqual({ capturing: true });
      expect(calls[calls.length - 1]).toEqual({ capturing: false });

      const didSetSnapshot = calls.some(
        (c) => 'pdfSnapshot' in c && c.pdfSnapshot !== undefined,
      );
      expect(didSetSnapshot).toBe(false);
    });

    it('resets capturing: false when the overall generation times out', async () => {
      vi.mocked(captureElementAsDataUrl).mockImplementationOnce(
        () => new Promise<never>(() => {}), // never resolves
      );
      vi.useFakeTimers();

      const { set, get } = makeStore();
      const effects = createEffects(set, get);

      const el = document.createElement('div');
      const refs = new Map([['card-1', el]]);

      const promise = effects.generatePdf([makeCard('card-1')], refs);
      vi.advanceTimersByTime(15_000);
      await promise;

      vi.useRealTimers();

      const calls = set.mock.calls.map((c) => c[0]) as Partial<PrintState>[];
      expect(calls[0]).toEqual({ capturing: true });
      expect(calls[calls.length - 1]).toEqual({ capturing: false });
    });

    it('preserves existing pdfSnapshot when a new capture fails', async () => {
      vi.mocked(captureElementAsDataUrl).mockRejectedValueOnce(
        new Error('render failed'),
      );

      const existingSnapshot = {
        images: ['data:image/png;base64,existing'],
        cutLines: true,
      };
      const { set, get } = makeStore({ pdfSnapshot: existingSnapshot });
      const effects = createEffects(set, get);

      const el = document.createElement('div');
      const refs = new Map([['card-1', el]]);

      await effects.generatePdf([makeCard('card-1')], refs);

      const calls = set.mock.calls.map((c) => c[0]) as Partial<PrintState>[];
      const lastCall = calls[calls.length - 1];
      expect(lastCall).toEqual({ capturing: false });
    });
  });

  describe('downloadPdf', () => {
    it('does nothing when there is no snapshot', async () => {
      const { set, get } = makeStore({ pdfSnapshot: null });
      const effects = createEffects(set, get);

      await effects.downloadPdf();

      expect(set).not.toHaveBeenCalled();
    });

    it('triggers a download when a snapshot is present', async () => {
      const { set, get } = makeStore({
        pdfSnapshot: {
          images: ['data:image/png;base64,abc'],
          cutLines: true,
        },
      });
      const effects = createEffects(set, get);

      const mockObjectUrl = 'blob:mock-url';
      vi.stubGlobal('URL', {
        createObjectURL: vi.fn().mockReturnValue(mockObjectUrl),
        revokeObjectURL: vi.fn(),
      });

      const clickSpy = vi.fn();
      vi.spyOn(document, 'createElement').mockImplementationOnce(() => {
        const a = Object.assign(document.createElement('a'), {
          click: clickSpy,
        });
        return a;
      });

      await effects.downloadPdf();

      expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      expect(clickSpy).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockObjectUrl);
    });
  });
});
