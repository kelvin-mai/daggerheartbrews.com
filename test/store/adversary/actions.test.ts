import { describe, it, expect, beforeEach } from 'vitest';
import { createActions } from '@/store/adversary/actions';
import { initialState } from '@/store/adversary';
import type { AdversaryState } from '@/store/adversary/types';
import type { ZustandGet, ZustandSet } from '@/store/types';

const makeStore = (initial?: Partial<AdversaryState>) => {
  let state: AdversaryState = { ...initialState, ...initial };

  const set: ZustandSet<AdversaryState> = (updater) => {
    if (typeof updater === 'function') {
      state = { ...state, ...(updater(state) as Partial<AdversaryState>) };
    } else {
      state = { ...state, ...updater };
    }
  };

  const get: ZustandGet<AdversaryState> = () => state;

  return { state: () => state, set, get };
};

describe('adversary/actions', () => {
  let store: ReturnType<typeof makeStore>;

  beforeEach(() => {
    store = makeStore();
  });

  describe('setLoading', () => {
    it('sets loading to true', () => {
      const actions = createActions(store.set, store.get);
      actions.setLoading(true);
      expect(store.state().loading).toBe(true);
    });

    it('sets loading to false', () => {
      store = makeStore({ loading: true });
      const actions = createActions(store.set, store.get);
      actions.setLoading(false);
      expect(store.state().loading).toBe(false);
    });
  });

  describe('setAdversaryDetails', () => {
    it('merges partial adversary details', () => {
      const actions = createActions(store.set, store.get);
      actions.setAdversaryDetails({ name: 'Goblin', hp: 10 });
      expect(store.state().adversary.name).toBe('Goblin');
      expect(store.state().adversary.hp).toBe(10);
    });

    it('preserves existing fields not in the update', () => {
      const actions = createActions(store.set, store.get);
      actions.setAdversaryDetails({ name: 'Troll' });
      expect(store.state().adversary.type).toBe('adversary');
      expect(store.state().adversary.thresholds).toEqual([5, 17]);
    });
  });

  describe('setUserAdversary', () => {
    it('sets userAdversary', () => {
      const actions = createActions(store.set, store.get);
      const userAdversary = {
        id: 'u1',
        userId: 'user1',
        adversary: store.state().adversary,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      actions.setUserAdversary(
        userAdversary as Parameters<typeof actions.setUserAdversary>[0],
      );
      expect(store.state().userAdversary).toEqual(userAdversary);
    });
  });
});
