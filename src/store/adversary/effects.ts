import { downloadElementAsImage } from '@/lib/utils';
import type { ZustandGet, ZustandSet } from '../types';
import type { AdversaryEffects, AdversaryState, AdversaryStore } from './types';

export const createEffects = (
  _: ZustandSet<AdversaryState>,
  get: ZustandGet<AdversaryStore>,
): AdversaryEffects => ({
  downloadStatblock: async () => {
    const { previewStatblock, adversary } = get();
    const { name, type } = adversary;
    try {
      if (previewStatblock?.current) {
        await downloadElementAsImage(
          previewStatblock.current,
          `daggerheart-${type}-${name}`,
        );
      }
    } catch (e) {
      console.error(e);
    }
  },
  saveAdversaryPreview: async () => {
    try {
      const { adversary, userAdversary } = get();
      const res = await fetch(
        `/api/adversary-preview/${userAdversary?.adversaryPreviewId && adversary.id && userAdversary?.adversaryPreviewId === adversary.id ? adversary.id : ''}`,
        {
          method: 'POST',
          body: JSON.stringify({ adversary, userAdversary }),
        },
      );
      const data = await res.json();
      if (!data.success) {
        throw Error(data.error.message);
      }
    } catch (e) {
      throw e;
    }
  },
});
