import type { ZustandSet } from '../types';
import type { PrintActions, PrintState } from './types';

const init =
  (set: ZustandSet<PrintState>): PrintActions['init'] =>
  (ids) =>
    set({ selectedIds: new Set(ids) });

const toggleCard =
  (set: ZustandSet<PrintState>): PrintActions['toggleCard'] =>
  (id) =>
    set((state) => {
      const selectedIds = new Set(state.selectedIds);
      if (selectedIds.has(id)) selectedIds.delete(id);
      else selectedIds.add(id);
      return { selectedIds };
    });

const setCutLines =
  (set: ZustandSet<PrintState>): PrintActions['setCutLines'] =>
  (cutLines) =>
    set({ cutLines });

const setSettings =
  (set: ZustandSet<PrintState>): PrintActions['setSettings'] =>
  (settings) =>
    set((state) => ({ settings: { ...state.settings, ...settings } }));

export const createActions = (set: ZustandSet<PrintState>): PrintActions => ({
  init: init(set),
  toggleCard: toggleCard(set),
  setCutLines: setCutLines(set),
  setSettings: setSettings(set),
});
