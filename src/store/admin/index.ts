import { create } from 'zustand';

import type { AudienceSyncState, AudienceSyncStore } from './types';
import { createActions } from './actions';
import { createEffects } from './effects';

const initialState: AudienceSyncState = {
  syncing: false,
  cancelling: false,
  cancelled: false,
  rows: null,
  progress: 0,
  total: 0,
  error: null,
  retrying: new Set(),
  page: 0,
};

export const useAudienceSyncStore = create<AudienceSyncStore>((set, get) => ({
  ...initialState,
  actions: createActions(set, get),
  effects: createEffects(set, get),
}));

export const useAudienceSyncActions = () =>
  useAudienceSyncStore((store) => store.actions);
export const useAudienceSyncEffects = () =>
  useAudienceSyncStore((store) => store.effects);
