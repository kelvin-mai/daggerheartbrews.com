import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createEffects } from '@/store/adversary/effects';
import { initialState } from '@/store/adversary';
import type { AdversaryStore } from '@/store/adversary/types';
import type { UserAdversary } from '@/lib/types';

vi.mock('@/lib/utils', () => ({
  downloadElementAsImage: vi.fn().mockResolvedValue(undefined),
}));

import { downloadElementAsImage } from '@/lib/utils';

const makeGet = (overrides: Partial<AdversaryStore> = {}) => {
  const store: AdversaryStore = {
    ...initialState,
    actions: {
      setLoading: vi.fn(),
      setAdversaryDetails: vi.fn(),
      setUserAdversary: vi.fn(),
      setPreviewStatblockRef: vi.fn(),
    },
    effects: {} as AdversaryStore['effects'],
    ...overrides,
  };

  return { get: () => store };
};

describe('adversary/effects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('downloadStatblock', () => {
    it('calls downloadElementAsImage with the correct filename', async () => {
      const element = document.createElement('div');
      const { get } = makeGet({
        adversary: {
          ...initialState.adversary,
          name: 'Goblin',
          type: 'minion',
        },
        previewStatblock: { current: element },
      });

      const effects = createEffects(vi.fn(), get);
      await effects.downloadStatblock();

      expect(downloadElementAsImage).toHaveBeenCalledWith(
        element,
        'daggerheart-minion-Goblin',
      );
    });

    it('does nothing when previewStatblock ref is null', async () => {
      const { get } = makeGet({ previewStatblock: { current: null } });

      const effects = createEffects(vi.fn(), get);
      await effects.downloadStatblock();

      expect(downloadElementAsImage).not.toHaveBeenCalled();
    });

    it('does nothing when previewStatblock is undefined', async () => {
      const { get } = makeGet({ previewStatblock: undefined });

      const effects = createEffects(vi.fn(), get);
      await effects.downloadStatblock();

      expect(downloadElementAsImage).not.toHaveBeenCalled();
    });

    it('swallows errors from downloadElementAsImage', async () => {
      vi.mocked(downloadElementAsImage).mockRejectedValueOnce(
        new Error('render failed'),
      );
      const element = document.createElement('div');
      const { get } = makeGet({ previewStatblock: { current: element } });

      const effects = createEffects(vi.fn(), get);
      await expect(effects.downloadStatblock()).resolves.toBeUndefined();
    });
  });

  describe('saveAdversaryPreview', () => {
    it('posts adversary and userAdversary to the preview endpoint', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ success: true }),
        }),
      );

      const { get } = makeGet({
        adversary: { ...initialState.adversary, id: 'adv-1' },
        userAdversary: undefined,
      });
      const effects = createEffects(vi.fn(), get);
      await effects.saveAdversaryPreview();

      expect(fetch).toHaveBeenCalledWith(
        '/api/adversary-preview/',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    it('uses adversary id in the URL when userAdversary preview id matches', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ success: true }),
        }),
      );

      const adversary = { ...initialState.adversary, id: 'adv-1' };
      const { get } = makeGet({
        adversary,
        userAdversary: { adversaryPreviewId: 'adv-1' } as UserAdversary,
      });
      const effects = createEffects(vi.fn(), get);
      await effects.saveAdversaryPreview();

      expect(fetch).toHaveBeenCalledWith(
        '/api/adversary-preview/adv-1',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    it('throws when the response indicates failure', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () =>
            Promise.resolve({
              success: false,
              error: { message: 'save failed' },
            }),
        }),
      );

      const { get } = makeGet();
      const effects = createEffects(vi.fn(), get);
      await expect(effects.saveAdversaryPreview()).rejects.toThrow(
        'save failed',
      );
    });

    it('rethrows unexpected fetch errors', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('network error')),
      );

      const { get } = makeGet();
      const effects = createEffects(vi.fn(), get);
      await expect(effects.saveAdversaryPreview()).rejects.toThrow(
        'network error',
      );
    });
  });
});
