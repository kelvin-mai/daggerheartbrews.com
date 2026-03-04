export type AdversaryFeature = {
  name: string;
  description: string;
  flavor?: string;
  type: string;
};

export type AdversaryDetails = {
  id?: string;
  name: string;
  type: string;
  source?: string;
  subtype?: string;
  image?: string;
  artist?: string;
  credits?: string;
  tier?: number;
  description?: string;
  subDescription?: string;
  experience?: string;
  text?: string;
  difficulty?: string;
  hp?: number;
  stress?: number;
  thresholds?: [number, number];
  attack?: string;
  weapon?: string;
  distance?: string;
  damageType?: string;
  damageAmount?: string;
  potential?: string;
};
