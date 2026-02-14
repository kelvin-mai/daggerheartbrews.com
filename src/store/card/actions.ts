import type { CardDetails, CardType } from '@/lib/types';
import type { ZustandGet, ZustandSet } from '../types';
import type { CardActions, CardState } from './types';

const setCardTypeDefaults =
  (set: ZustandSet<CardState>, get: ZustandGet<CardState>) =>
  (type: CardType) => {
    const defaults = (): Partial<CardDetails> => {
      const state = get();
      switch (type) {
        case 'equipment':
          return { tier: 1, armor: 1, hands: 1, subtitle: 'item' };
        case 'domain':
          const defaultDomain = state.domains?.length
            ? state.domains[0]
            : { name: 'custom', color: '#797979' };
          return {
            subtype: 'ability',
            stress: 0,
            level: 1,
            domainPrimary: defaultDomain.name,
            domainPrimaryColor: defaultDomain.color,
            domainSecondary: defaultDomain.name,
            domainSecondaryColor: defaultDomain.color,
          };
        case 'class':
          return {
            name: state.classes?.length ? state.classes[0].name : '',
            subtitle: 'class features',
          };
        case 'subclass':
          const defaultSubclassDomain =
            state.domains?.length && state.classes?.length
              ? {
                  primary: state.domains.find(
                    (d) => d.name === state.classes![0].domainPrimary,
                  ),
                  secondary: state.domains.find(
                    (d) => d.name === state.classes![0].domainSecondary,
                  ),
                }
              : {
                  primary: { name: 'custom', color: '#000000' },
                  secondary: { name: 'custom', color: '#ffffff' },
                };
          return {
            subtype: state.classes?.length ? state.classes[0].name : '',
            subtitle: 'foundation',
            domainPrimary: defaultSubclassDomain.primary?.name,
            domainPrimaryColor: defaultSubclassDomain.primary?.color,
            domainSecondary: defaultSubclassDomain.secondary?.name,
            domainSecondaryColor: defaultSubclassDomain.secondary?.name,
          };
        case 'ancestry':
        case 'community':
        default:
          return {};
      }
    };
    return set((state) => ({
      ...state,
      card: { ...state.card, type, ...defaults() },
    }));
  };

const setCardDetails =
  (set: ZustandSet<CardState>): CardActions['setCardDetails'] =>
  (details) => {
    set((state) => {
      // Filter out undefined values to prevent overwriting existing data
      const filteredDetails = Object.fromEntries(
        Object.entries(details).filter(([_, value]) => value !== undefined)
      );
      
      return { 
        ...state, 
        card: { ...state.card, ...filteredDetails },
        // Load card back settings from card data if available
        settings: {
          ...state.settings,
          cardBack: details.cardBack || state.settings.cardBack || 'default',
          customCardBackLogo: details.customCardBackLogo || state.settings.customCardBackLogo || undefined,
        }
      };
    });
  };

const setUserCard =
  (set: ZustandSet<CardState>): CardActions['setUserCard'] =>
  (userCard) =>
    set({ userCard });

const setSettings =
  (set: ZustandSet<CardState>): CardActions['setSettings'] =>
  (settings) =>
    set((state) => ({
      ...state,
      settings: { ...state.settings, ...settings },
    }));

const setOptions =
  (set: ZustandSet<CardState>): CardActions['setOptions'] =>
  ({ domains, classes }) =>
    set({ domains, classes });

export const createActions = (
  set: ZustandSet<CardState>,
  get: ZustandGet<CardState>,
): CardActions => ({
  setLoading: (loading: boolean) => set({ loading }),
  setPreviewRef: (ref: React.RefObject<HTMLDivElement | null>) =>
    set({ preview: ref }),
  setCardBackPreviewRef: (ref: React.RefObject<HTMLDivElement | null>) =>
    set({ cardBackPreview: ref }),
  setCardTypeDefaults: setCardTypeDefaults(set, get),
  setCardDetails: setCardDetails(set),
  setUserCard: setUserCard(set),
  setSettings: setSettings(set),
  setOptions: setOptions(set),
});
