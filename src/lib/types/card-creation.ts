export const cardTypes = [
  'ancestry',
  'community',
  'transformation',
  'equipment',
  'domain',
  'class',
  'subclass',
] as const;

export const domainAbilityTypes = ['ability', 'spell', 'grimoire'] as const;

export const traitTypes = [
  'agility',
  'strength',
  'finesse',
  'instinct',
  'presence',
  'knowledge',
] as const;

export type CardType = (typeof cardTypes)[number];

export type CardClassOption = {
  id: string;
  name: string;
  domainPrimary: string;
  domainSecondary: string;
  source: string;
};

export type CardDomainOption = {
  id: string;
  name: string;
  color: string;
  source: string;
};

export type CardSettings = {
  border: boolean;
  boldRulesText: boolean;
  artist: boolean;
  credits: boolean;
  placeholderImage: boolean;
  cardBack: 'default' | 'custom';
  customCardBackLogo?: string;
};

export type CardDetails = {
  id?: string;
  name: string;
  type: CardType;
  image?: string;
  text?: string;
  artist?: string;
  credits?: string;
  subtype?: string;
  subtitle?: string;
  level?: number;
  stress?: number;
  evasion?: number;
  thresholds?: [number, number];
  thresholdsEnabled?: boolean;
  tier?: number;
  tierEnabled?: boolean;
  hands?: number;
  handsEnabled?: boolean;
  armor?: number;
  armorEnabled?: boolean;
  domainPrimary?: string;
  domainPrimaryColor?: string;
  domainPrimaryIcon?: string;
  domainSecondary?: string;
  domainSecondaryColor?: string;
  domainSecondaryIcon?: string;
  cardBack?: 'default' | 'custom';
  customCardBackLogo?: string;
};
