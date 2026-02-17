import { describe, it, expect, beforeEach } from 'vitest';
import { createActions } from '@/store/card/actions';
import { initialState } from '@/store/card';
import type { CardState } from '@/store/card/types';
import type { ZustandGet, ZustandSet } from '@/store/types';

const testDomains = [
  { id: 'd1', name: 'blade', color: '#ff0000', source: 'srd' },
  { id: 'd2', name: 'bone', color: '#0000ff', source: 'srd' },
];

const testClasses = [
  {
    id: 'c1',
    name: 'Warrior',
    domainPrimary: 'blade',
    domainSecondary: 'bone',
    source: 'srd',
  },
];

const makeStore = (initial?: Partial<CardState>) => {
  let state: CardState = {
    ...initialState,
    classes: testClasses,
    domains: testDomains,
    ...initial,
  };

  const set: ZustandSet<CardState> = (updater) => {
    if (typeof updater === 'function') {
      state = { ...state, ...(updater(state) as Partial<CardState>) };
    } else {
      state = { ...state, ...updater };
    }
  };

  const get: ZustandGet<CardState> = () => state;

  return { state: () => state, set, get };
};

describe('card/actions', () => {
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

  describe('setCardDetails', () => {
    it('merges partial card details', () => {
      const actions = createActions(store.set, store.get);
      actions.setCardDetails({ name: 'My Card', level: 3 });
      expect(store.state().card.name).toBe('My Card');
      expect(store.state().card.level).toBe(3);
    });

    it('preserves existing card fields not in the update', () => {
      const actions = createActions(store.set, store.get);
      actions.setCardDetails({ name: 'Updated' });
      expect(store.state().card.type).toBe('ancestry');
      expect(store.state().card.thresholds).toEqual([5, 12]);
    });
  });

  describe('setSettings', () => {
    it('merges partial settings', () => {
      const actions = createActions(store.set, store.get);
      actions.setSettings({ border: false });
      expect(store.state().settings.border).toBe(false);
      expect(store.state().settings.boldRulesText).toBe(true);
    });
  });

  describe('setOptions', () => {
    it('sets domains and classes', () => {
      const actions = createActions(store.set, store.get);
      const newDomains = [
        { id: 'x1', name: 'fire', color: '#f00', source: 'custom' },
      ];
      const newClasses = [
        {
          id: 'x2',
          name: 'Mage',
          domainPrimary: 'fire',
          domainSecondary: 'fire',
          source: 'custom',
        },
      ];
      actions.setOptions({ domains: newDomains, classes: newClasses });
      expect(store.state().domains).toEqual(newDomains);
      expect(store.state().classes).toEqual(newClasses);
    });
  });

  describe('setCardTypeDefaults', () => {
    it('sets equipment defaults', () => {
      const actions = createActions(store.set, store.get);
      actions.setCardTypeDefaults('equipment');
      const card = store.state().card;
      expect(card.type).toBe('equipment');
      expect(card.tier).toBe(1);
      expect(card.armor).toBe(1);
      expect(card.hands).toBe(1);
      expect(card.subtitle).toBe('item');
    });

    it('sets domain defaults using first available domain', () => {
      const actions = createActions(store.set, store.get);
      actions.setCardTypeDefaults('domain');
      const card = store.state().card;
      expect(card.type).toBe('domain');
      expect(card.subtype).toBe('ability');
      expect(card.stress).toBe(0);
      expect(card.level).toBe(1);
      expect(card.domainPrimary).toBe('blade');
    });

    it('sets class defaults using first available class', () => {
      const actions = createActions(store.set, store.get);
      actions.setCardTypeDefaults('class');
      const card = store.state().card;
      expect(card.type).toBe('class');
      expect(card.name).toBe('Warrior');
      expect(card.subtitle).toBe('class features');
    });

    it('sets subclass defaults from first class domains', () => {
      const actions = createActions(store.set, store.get);
      actions.setCardTypeDefaults('subclass');
      const card = store.state().card;
      expect(card.type).toBe('subclass');
      expect(card.subtype).toBe('Warrior');
      expect(card.subtitle).toBe('foundation');
      expect(card.domainPrimary).toBe('blade');
    });

    it('sets no defaults for ancestry type', () => {
      const actions = createActions(store.set, store.get);
      actions.setCardDetails({ name: 'Keep Me' });
      actions.setCardTypeDefaults('ancestry');
      expect(store.state().card.type).toBe('ancestry');
      expect(store.state().card.name).toBe('Keep Me');
    });
  });

  describe('setUserCard', () => {
    it('sets userCard', () => {
      const actions = createActions(store.set, store.get);
      const userCard = {
        id: 'u1',
        userId: 'user1',
        card: store.state().card,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      actions.setUserCard(
        userCard as Parameters<typeof actions.setUserCard>[0],
      );
      expect(store.state().userCard).toEqual(userCard);
    });

    it('clears userCard when called with undefined', () => {
      const actions = createActions(store.set, store.get);
      actions.setUserCard(undefined);
      expect(store.state().userCard).toBeUndefined();
    });
  });
});
