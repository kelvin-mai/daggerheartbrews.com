import { create } from 'zustand';

import type { PrintState, PrintStore } from './types';
import { createActions } from './actions';
import { createEffects } from './effects';

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

export const usePrintStore = create<PrintStore>((set, get) => ({
  ...initialState,
  actions: createActions(set),
  effects: createEffects(set, get),
}));

export const usePrintActions = () => usePrintStore((store) => store.actions);
export const usePrintEffects = () => usePrintStore((store) => store.effects);
