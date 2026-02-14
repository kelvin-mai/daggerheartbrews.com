import type {
  CardClassOption,
  CardDetails,
  CardDomainOption,
  CardSettings,
  CardType,
  UserCard,
} from '@/lib/types';

export type CardState = {
  loading: boolean;
  settings: CardSettings;
  userCard?: UserCard;
  card: CardDetails;
  preview?: React.RefObject<HTMLElement | null>;
  cardBackPreview?: React.RefObject<HTMLElement | null>;
  classes?: CardClassOption[];
  domains?: CardDomainOption[];
};

export type CardComputed = {
  domainColor(domain: string): string;
  domainIncludes(domain: string): boolean | undefined;
  classDomains(className: string): {
    primary: string;
    secondary: string;
  };
  classColors(className: string): {
    primary: string;
    secondary: string;
  };
};

export type CardActions = {
  setLoading(loading: boolean): void;
  setPreviewRef(ref: React.RefObject<HTMLDivElement | null>): void;
  setCardBackPreviewRef(ref: React.RefObject<HTMLDivElement | null>): void;
  setCardTypeDefaults(type: CardType): void;
  setCardDetails(details: Partial<CardDetails>): void;
  setUserCard(userCard?: UserCard): void;
  setSettings(settings: Partial<CardSettings>): void;
  setOptions(allOptions: {
    domains: CardDomainOption[];
    classes: CardClassOption[];
  }): void;
};

export type CardEffects = {
  downloadImage(): void;
  downloadCardBackImage(): void;
  loadOptions(): void;
  saveCardPreview(): Promise<void>;
};

export type CardStore = CardState & {
  computed: CardComputed;
  actions: CardActions;
  effects: CardEffects;
};
