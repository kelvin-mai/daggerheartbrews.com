import {
  assertPayloadSize,
  downloadElementAsImage,
  parseJSONResponse,
} from '@/lib/utils';
import type { ZustandGet, ZustandSet } from '../types';
import type { AdversaryEffects, AdversaryState, AdversaryStore } from './types';

export const createEffects = (
  _: ZustandSet<AdversaryState>,
  get: ZustandGet<AdversaryStore>,
): AdversaryEffects => ({
  downloadStatblock: async () => {
    const { exportStatblock, adversary, resolution } = get();
    const { name, type } = adversary;
    try {
      if (exportStatblock?.current) {
        await downloadElementAsImage(
          exportStatblock.current,
          `daggerheart-${type}-${name}`,
          { pixelRatio: resolution },
        );
      }
    } catch (e) {
      console.error(e);
    }
  },
  saveAdversaryPreview: async () => {
    const { adversary, userAdversary } = get();
    const body = { adversary, userAdversary };
    assertPayloadSize(body);
    const res = await fetch(
      `/api/adversary-preview/${userAdversary?.adversaryPreviewId && adversary.id && userAdversary?.adversaryPreviewId === adversary.id ? adversary.id : ''}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
    const data = await parseJSONResponse<{
      success: boolean;
      error?: { message: string };
    }>(res);
    if (!data.success) {
      throw new Error(data.error?.message);
    }
  },
});
