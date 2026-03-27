import type { ZustandGet, ZustandSet } from '../types';
import type { AdversaryActions, AdversaryState } from './types';

export const createActions = (
  set: ZustandSet<AdversaryState>,
  _get: ZustandGet<AdversaryState>,
): AdversaryActions => ({
  setLoading: (loading) => set({ loading }),
  setAdversaryDetails: (details) =>
    set((state) => ({
      ...state,
      adversary: {
        ...state.adversary,
        ...details,
      },
    })),
  setUserAdversary: (userAdversary) => set({ userAdversary }),
  setPreviewStatblockRef: (ref: React.RefObject<HTMLDivElement | null>) =>
    set({ previewStatblock: ref }),
  setExportStatblockRef: (ref: React.RefObject<HTMLDivElement | null>) =>
    set({ exportStatblock: ref }),
  setResolution: (resolution) => set({ resolution }),
});
