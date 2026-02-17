import { create } from 'zustand';

import type { AdversaryState, AdversaryStore } from './types';
import { createActions } from './actions';
import { createEffects } from './effects';

export const initialState: AdversaryState = {
  loading: true,
  adversary: {
    name: '',
    type: 'adversary',
    thresholds: [5, 17],
    hp: 5,
    stress: 2,
  },
};

export const useAdversaryStore = create<AdversaryStore>((set, get) => ({
  ...initialState,
  actions: createActions(set, get),
  effects: createEffects(set, get),
}));

export const useAdversaryActions = () =>
  useAdversaryStore((store) => store.actions);

export const useAdversaryEffects = () =>
  useAdversaryStore((store) => store.effects);
