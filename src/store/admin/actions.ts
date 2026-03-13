import type { ZustandGet, ZustandSet } from '../types';
import type { AudienceSyncActions, AudienceSyncState } from './types';

export const createActions = (
  set: ZustandSet<AudienceSyncState>,
  _get: ZustandGet<AudienceSyncState>,
): AudienceSyncActions => ({
  setPage: (page) => set({ page }),
  cancel: () => set({ cancelling: true }),
});
