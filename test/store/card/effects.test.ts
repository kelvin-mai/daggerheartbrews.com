import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createEffects } from '@/store/card/effects';
import { initialState } from '@/store/card';
import type { CardStore } from '@/store/card/types';
import type { UserCard } from '@/lib/types';

vi.mock('@/lib/utils', () => ({
  downloadElementAsImage: vi.fn().mockResolvedValue(undefined),
}));

import { downloadElementAsImage } from '@/lib/utils';

const makeGet = (overrides: Partial<CardStore> = () => {}) => {
  const setOptions = vi.fn();
  const setLoading = vi.fn();

  const store: CardStore = {
    ...initialState,
    computed: {} as CardStore['computed'],
    actions: {
      setLoading,
      setOptions,
      setPreviewRef: vi.fn(),
      setCardTypeDefaults: vi.fn(),
      setCardDetails: vi.fn(),
      setUserCard: vi.fn(),
      setSettings: vi.fn(),
    },
    effects: {} as CardStore['effects'],
    ...overrides,
  };

  return { get: () => store, setOptions, setLoading };
};

describe('card/effects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('downloadImage', () => {
    it('calls downloadElementAsImage with the correct filename', async () => {
      const element = document.createElement('div');
      const { get } = makeGet({
        card: { ...initialState.card, name: 'Fireball', type: 'domain' },
        preview: { current: element },
      });

      const effects = createEffects(vi.fn(), get);
      await effects.downloadImage();

      expect(downloadElementAsImage).toHaveBeenCalledWith(
        element,
        'daggerheart-domain-Fireball',
      );
    });

    it('does nothing when preview ref is null', async () => {
      const { get } = makeGet({ preview: { current: null } });

      const effects = createEffects(vi.fn(), get);
      await effects.downloadImage();

      expect(downloadElementAsImage).not.toHaveBeenCalled();
    });

    it('does nothing when preview is undefined', async () => {
      const { get } = makeGet({ preview: undefined });

      const effects = createEffects(vi.fn(), get);
      await effects.downloadImage();

      expect(downloadElementAsImage).not.toHaveBeenCalled();
    });

    it('swallows errors from downloadElementAsImage', async () => {
      vi.mocked(downloadElementAsImage).mockRejectedValueOnce(
        new Error('render failed'),
      );
      const element = document.createElement('div');
      const { get } = makeGet({ preview: { current: element } });

      const effects = createEffects(vi.fn(), get);
      await expect(effects.downloadImage()).resolves.toBeUndefined();
    });
  });

  describe('loadOptions', () => {
    it('fetches and sets options when domains and classes are not loaded', async () => {
      const mockData = {
        domains: [{ id: 'd1', name: 'blade', color: '#f00', source: 'srd' }],
        classes: [
          {
            id: 'c1',
            name: 'Warrior',
            domainPrimary: 'blade',
            domainSecondary: 'bone',
            source: 'srd',
          },
        ],
      };
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve(mockData),
        }),
      );

      const { get, setOptions, setLoading } = makeGet({
        domains: undefined,
        classes: undefined,
      });
      const effects = createEffects(vi.fn(), get);
      await effects.loadOptions();

      expect(fetch).toHaveBeenCalledWith('/api/card-options');
      expect(setLoading).toHaveBeenCalledWith(true);
      expect(setOptions).toHaveBeenCalledWith(mockData);
      expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('skips fetch when options are already loaded', async () => {
      vi.stubGlobal('fetch', vi.fn());

      const { get } = makeGet({
        domains: [{ id: 'd1', name: 'blade', color: '#f00', source: 'srd' }],
        classes: [
          {
            id: 'c1',
            name: 'Warrior',
            domainPrimary: 'blade',
            domainSecondary: 'bone',
            source: 'srd',
          },
        ],
      });
      const effects = createEffects(vi.fn(), get);
      await effects.loadOptions();

      expect(fetch).not.toHaveBeenCalled();
    });

    it('swallows fetch errors', async () => {
      vi.spyOn(console, 'error').mockImplementationOnce(() => {});
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('network error')),
      );

      const { get } = makeGet({ domains: undefined, classes: undefined });
      const effects = createEffects(vi.fn(), get);
      await expect(effects.loadOptions()).resolves.toBeUndefined();
    });
  });

  describe('saveCardPreview', () => {
    it('posts card and userCard to the preview endpoint', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ success: true }),
        }),
      );

      const { get } = makeGet({
        card: { ...initialState.card, id: 'card-1' },
        userCard: undefined,
      });
      const effects = createEffects(vi.fn(), get);
      await effects.saveCardPreview();

      expect(fetch).toHaveBeenCalledWith(
        '/api/card-preview/',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    it('uses card id in the URL when userCard preview id matches', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ success: true }),
        }),
      );

      const card = { ...initialState.card, id: 'card-1' };
      const { get } = makeGet({
        card,
        userCard: { cardPreviewId: 'card-1' } as UserCard,
      });
      const effects = createEffects(vi.fn(), get);
      await effects.saveCardPreview();

      expect(fetch).toHaveBeenCalledWith(
        '/api/card-preview/card-1',
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
      await expect(effects.saveCardPreview()).rejects.toThrow('save failed');
    });
  });
});
