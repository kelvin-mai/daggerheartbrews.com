import type {
  AdversaryDetails,
  AdversaryFeature,
} from '@/lib/types/adversary-creation';

export type Feature = {
  name: string;
  description: string;
  extra?: string;
};

export type SubclassReference = {
  className: string;
  name: string;
  image: string | null;
  artist: string;
  description: string;
  source?: string;
  trait?: string;
  foundation: Feature[];
  specialization: Feature[];
  mastery: Feature[];
};

export type ClassReference = {
  name: string;
  flavor: string;
  source?: string;
  domains: [string, string];
  startEvasion: number;
  startHp: number;
  items: string;
  features: Feature[];
  questions: string[];
  connections: string[];
  subclasses: string[];
};

export type PreBeastform = {
  name: string;
  tier: number;
  traitBonuses?: [string, string];
  weaponTrait?: string;
  distance?: string;
  damage?: string;
  damageType?: string;
  advantage?: string;
  examples: string;
  features: Feature[];
};

export type PreAdversaryDetails = Omit<AdversaryDetails, 'text' | 'type'> & {
  features: (AdversaryFeature & { extra?: string })[];
};
